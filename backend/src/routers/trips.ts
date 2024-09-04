import { Hono } from "hono";
import {  PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const groupRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();


function formatDate(date: Date){
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        weekday: "short", // abbreviated weekday name (e.g., 'Mon')
        month: "short", // abbreviated month name (e.g., 'Oct')
        day: "numeric", // numeric day of the month (e.g., '25')
        hour: "numeric", // numeric hour (e.g., '8')
        minute: "numeric", // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const formattedDateTime: string = new Date(date).toLocaleString(
        "en-US",
        dateTimeOptions
    );

    return formattedDateTime;
}


groupRouter.get('/decode/get-group', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId')

        const groups = await prisma.groupMember.findMany({
            where:{
                userId: userId
            }
        })


        if (groups.length === 0) {
            return c.json({
                error: 'User is not a member of any group'
            }, 404);
        }

        const groupDetails = await Promise.all(groups.map(async (g) => {
            const group = await prisma.group.findFirst({
                where: {
                    id: g.groupId
                }
            });

            if (!group) {
                return null;
            }

            return {
                id: group.id,
                title: group.title,
                description: group.description,
                date: group.createdAt ? formatDate(group.createdAt) : null,
                balance: g.balance
            };
        }));

        const validGroupDetails = groupDetails.filter(g => g !== null);

        return c.json({
            groups: validGroupDetails
        });
        
    } catch (error) {
        console.error('Server-Site Error in Retrieving Group: ', error)
        return c.json({
            error: 'Server-Site Error in Retrieving Group'
        }, 500)
    }
})

groupRouter.get('/decode/get-group/:id', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const id = c.req.param('id')
        const userId = c.get('userId')

        const title = await prisma.group.findFirst({
            where:{
                id: id
            }, 
            select:{
                title: true
            }
        })

        if(!title) {
            return c.json({
                error: "Invalid Group Id"
            }, 403)
        }

        const memberId = await prisma.groupMember.findMany({
            where:{
                groupId: id
            },
            select:{
                userId: true,
            }
        })

        const members = await Promise.all(memberId.map(async (m) => {
            const detail = await prisma.user.findFirst({
                where: {
                    id: m.userId,
                },
                select: {
                    firstname: true,
                    lastname: true,
                },
            });
        
            if (!detail) {
                return null; // Handle the case where user details are not found
            }
        
            return {
                id: m.userId,
                name: `${detail.firstname} ${detail.lastname}`,
            };
        }));
        
        // Filter out null members
        const validMembers = members.filter((m) => m !== null);

        if (validMembers.length === 0) {
            return c.json({
                error: 'Member Does Not Exist',
            }, 400);
        }

        const account = await prisma.groupMember.findFirst({
            where:{
                userId: userId,
                groupId: id
            },
            select:{
                balance: true,
                totalExpenditure: true,
            }
        })

        if(!account){
            return c.json({
                error: "Bad Request"
            }, 400)
        }

        const transaction = await prisma.groupTransaction.findMany({
            where:{
                groupId: id,
            }
        })

        const transactionDetails = await Promise.all(transaction.map(async (t) => {
            const share = await prisma.share.findFirst({
                where: {
                    transactionId: t.id,
                    userId: userId,
                },
                select: {
                    shareAmount: true,
                },
            });
        
            if (!share) {
                return null;
            }
        
            const paidByMember = validMembers.find((member) => member.id === t.paidByUserId);
        
            return {
                name: t.description,
                paidBy: paidByMember?.name || 'Unknown',
                date: formatDate(t.transactionDate),
                share: share.shareAmount,
                amount: t.amount,
            };
        }));
        
        // Filter out any null transactions
        const validTransactionDetails = transactionDetails.filter((t) => t !== null);

        return c.json({
            TransactionDetails: validTransactionDetails,
            title: title.title,
            members: validMembers,
            account: account,
        });

    } catch (error) {
        console.error('Server-Site Error in Retrieving Group By Id: ', error)
        return c.json({
            error: 'Server-Site Error in Retrieving Group By Id'
        }, 500)
    }
})


interface AddGroupTransactionDetail {
    description: string,
    amount: number,
    // paidByUserId: string,
    groupId: string,
    shares: {
        [userId: string]: number; 
    }
}

groupRouter.post('/decode/add-group-transaction', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId')

        const details : AddGroupTransactionDetail = await c.req.json()

        if (details.amount <= 0) {
            return c.json({ error: 'Amount must be greater than zero' }, 400);
        }

        const transaction = await prisma.groupTransaction.create({
            data: {
                description: details.description,
                amount: details.amount,
                paidByUserId: userId,
                groupId: details.groupId
            }
        })

        for (const Id in details.shares) {
            await prisma.share.create({
                data:{
                    userId: Id,
                    transactionId: transaction.id,
                    shareAmount: details.shares[Id] 
                }
            })
        }

        return c.json({
            message: "Group Transaction Added Successfully"
        })
        
        
    } catch (error) {
        console.error('Server-Site Error in Adding Group Transactions: ', error)
        return c.json({
            error: 'Server-Site Error in Adding Group Transactions'
        }, 500)
    }
})


interface AddGroupDetail {
    title: string,
    description: string,
    // members: string[]
}

groupRouter.post('/decode/add-group', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: AddGroupDetail = await c.req.json();
        const userId = c.get('userId')

        const createGroup = await prisma.group.create({
            data:{
                title: detail.title,
                description: detail.description
            }
        })

        await prisma.groupMember.create({
            data:{
                groupId: createGroup.id,
                userId: userId,
                balance: 0,
                totalExpenditure: 0
            }
        })

        // detail.members.push(userId)

        // detail.members.map(async (m) => {
        //     await prisma.groupMember.create({
        //         data:{
        //             groupId: createGroup.id,
        //             userId: m,
        //             balance: 0,
        //             totalExpenditure: 0
        //         }
        //     })
        // })

        return c.json({
            message: "Group Added Successfully"
        })

    } catch (error) {
        console.error('Server-Site Error in Adding Group: ', error)
        return c.json({
            error: 'Server-Site Error in Adding Group'
        }, 500)
    }
})


interface AddMemberDetail {
    groupId: string, 
    userId: string
}

groupRouter.post('/add-group-member', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: AddMemberDetail = await c.req.json();

        await prisma.groupMember.create({
            data:{
                userId: detail.userId,
                groupId: detail.groupId,
                balance: 0,
                totalExpenditure: 0
            }
        })

        return c.json({
            message: "Member Added Successfully"
        })
        
    } catch (error) {
        console.error('Server-Site Error in Adding Member in a Group: ', error)
        return c.json({
            error: 'Server-Site Error in Adding Member in a Group'
        }, 500)
    }
})