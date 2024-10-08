import { Hono } from "hono";
import {  PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { AddGroupTransactionSchema, AddGroupTransactionType } from "../schemas";
import bcrypt from 'bcryptjs';
import { verify } from "hono/jwt";

export const groupRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  
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


groupRouter.use("/decode/*", async (c, next) => {
    const token = c.req.header("authorization") || "";
  
    try {
        const user: any = await verify(token, c.env.JWT_SECRET)
        c.set("userId", user.id);
  
        await next();
  
    } catch (err) {
        return c.json({
            error: "You Are Not Logged In"
        }, 400)
    }
})

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
        }, 200);
        
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
                return null;
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
                id: t.id,
                name: t.description,
                paidBy: paidByMember?.name || 'Unknown',
                date: formatDate(t.transactionDate),
                share: share.shareAmount,
                amount: t.amount,
            };
        }));
        
        const validTransactionDetails = transactionDetails.filter((t) => t !== null);

        return c.json({
            TransactionDetails: validTransactionDetails,
            title: title.title,
            members: validMembers,
            account: account,
        }, 200);

    } catch (error) {
        console.error('Server-Site Error in Retrieving Group By Id: ', error)
        return c.json({
            error: 'Server-Site Error in Retrieving Group By Id'
        }, 500)
    }
})


// interface AddGroupTransactionDetail {
//     description: string,
//     amount: number,
//     // paidByUserId: string,
//     groupId: string,
//     shares: {
//         [userId: string]: number; 
//     }
// }

groupRouter.post('/decode/add-group-transaction', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId')

        const details : AddGroupTransactionType = await c.req.json()
        console.log(details)
        const zodResult = AddGroupTransactionSchema.safeParse(details)
        if(!zodResult.success){
            console.log(zodResult.error.errors)
            return c.json({
                error: 'Invalid Format'
            }, 401)
        }

        const dbPin = await prisma.user.findFirst({
            where:{
                id:userId
            },
            select:{
                pin: true
            }
        })

        if(!dbPin){
            return c.json({
                error: "Bad Request"
            }, 400)
        }

        const isMatch = await bcrypt.compare(details.pin, dbPin.pin)
        if(!isMatch){
            return c.json({
                error: "Invalid Pin"
            }, 401)
        }

        for(const id in details.shares) {
            const user = await prisma.user.findFirst({
                where:{
                    id: id
                }
            })

            if(!user){
                return c.json({
                    error: 'Member Does Not Exists'
                }, 404)
            }
        }

        let amount = details.amount;
        for(const id in details.shares) {
            amount -= details.shares[id]
        }

        if(amount != 0){
            return c.json({
                error: 'The sum of all shares must equal the total amount.'
            }, 400)
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

            if(Id === userId) continue;

            await prisma.groupMember.update({
                where:{
                    groupId_userId: {
                        groupId: details.groupId,
                        userId: Id
                    }
                },
                data: {
                    balance: {
                        decrement: details.shares[Id]
                    }
                }
            })
        }

        await prisma.groupMember.update({
            where: {
                groupId_userId: {
                    userId: userId,
                    groupId: details.groupId
                }
            },
            data:{
                balance: {
                    increment: (details.amount - details.shares[userId])
                },
                totalExpenditure: {
                    increment: details.amount
                },
            }
        })

        return c.json({
            message: "Group Transaction Added Successfully"
        }, 200)
        
        
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
}

groupRouter.post('/decode/add-group', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: AddGroupDetail = await c.req.json();
        const userId = c.get('userId'); 

        const createGroup = await prisma.group.create({
            data: {
                title: detail.title,
                description: detail.description,
            },
        });

        
        await prisma.groupMember.create({
            data: {
                groupId: createGroup.id,
                userId: userId,
                balance: 0,
                totalExpenditure: 0,
            },
        });

        return c.json({
            message: 'Group Added Successfully',
        }, 200);

    } catch (error) {
        console.error('Server-Side Error in Adding Group: ', error);
        return c.json({
            error: 'Server-Side Error in Adding Group',
        }, 500);
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
        }, 200)
        
    } catch (error) {
        console.error('Server-Site Error in Adding Member in a Group: ', error)
        return c.json({
            error: 'Server-Site Error in Adding Member in a Group'
        }, 500)
    }
})


groupRouter.post('/decode/delete-group', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const { id }: { id: string } = await c.req.json();
        // const userId = c.get('userId');

        const group = await prisma.group.findFirst({
            where:{
                id: id
            }
        })

        if(!group){
            return c.json({
                error: 'Group Does Not Exists'
            }, 401)
        }

        await prisma.group.delete({
            where: {
                id: id
            }
        })

        return c.json({
            message: 'Group Deleted Successfully'
        }, 200)

    } catch (error) {
        console.error('Server-Site Error in Deleting a Group: ', error)
        return c.json({
            error: 'Server-Site Error in Deleting a Group'
        }, 500)
    }
})



groupRouter.post('/delete-group-transaction', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const { id }: { id: string } = await c.req.json();

        const transaction = await prisma.groupTransaction.findFirst({
            where:{
                id: id
            }
        })

        if(!transaction){
            return c.json({
                error: 'Group Transaction Does Not Exists'
            }, 401)
        }

        await prisma.$transaction(async(prisma) => {
            await prisma.groupMember.update({
                where: {
                    groupId_userId: {
                        groupId: transaction.groupId,
                        userId: transaction.paidByUserId
                    }
                },
                data: {
                    totalExpenditure: {
                        decrement: transaction.amount
                    },
                }
            });

            const shares = await prisma.share.findMany({
                where: {
                    transactionId: transaction.id
                }
            });

            await Promise.all(shares.map(async (share) => {

                if(share.userId === transaction.paidByUserId){
                    await prisma.groupMember.update({
                        where: {
                            groupId_userId: {
                                groupId: transaction.groupId,
                                userId: share.userId
                            }
                        },
                        data: {
                            balance: {
                                decrement: (transaction.amount)
                            }
                        }
                    });
                }

                await prisma.groupMember.update({
                    where: {
                        groupId_userId: {
                            groupId: transaction.groupId,
                            userId: share.userId
                        }
                    },
                    data: {
                        balance: {
                            increment: share.shareAmount
                        }
                    }
                });
            }));

            await prisma.groupTransaction.delete({
                where: {
                    id: id
                }
            });
        });

        return c.json({
            message: 'Group Transaction Deleted Successfully'
        }, 200)
        
    } catch (error) {
        console.error('Server-Site Error in Deleting a Group Transaction: ', error)
        return c.json({
            error: 'Server-Site Error in Deleting a Group Transaction'
        }, 500)
    }
})