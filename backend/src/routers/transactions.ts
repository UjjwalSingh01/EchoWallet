import { Hono } from "hono";
import { PrismaClient, TransactionCategory } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { TransferSchema, TransferType } from "../schemas";

export const transactionRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();

// paginated transaction ... transfer ... balance credits debits 


function formateDate(date: Date){
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


transactionRouter.use("/decode/*", async (c, next) => {
    try {
        const token = c.req.header("authorization") || "";

        if(!token) {
            return c.json({
                error: "Token Not Given"
            }, 400)
        }

        const user: any = await verify(token, c.env.JWT_SECRET)
        c.set("userId", user.id);
  
        await next();
  
    } catch (err) {
        return c.json({
            message: "You Are Not Logged In"
        }, 403)
    }
})


// type TransactionDetails = {
//     name: string, 
//     date: string,
//     amount: number
// }

transactionRouter.get('/decode/gettransaction', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId: string = c.get('userId');

        const transactions = await prisma.transaction.findMany({
            where: {
                accountId: userId,
            },
        });

        // Function to fetch recipient details by recipientId
        async function getRecipientDetails(recipientId: string) {
            return prisma.user.findUnique({
                where: { id: recipientId },
                select: { firstname: true, lastname: true },
            });
        }

        // Fetch recipient details for all transactions and combine them
        const transactionsWithRecipientDetails = await Promise.all(transactions.map(async (transaction) => {
            const recipient = await getRecipientDetails(transaction.recipientId);
            return {
                ...transaction,
                recipient: recipient || { firstname: '', lastname: '' } // Handle case where recipient is not found
            };
        }));

        const TransactionDetails = transactionsWithRecipientDetails.map(t => {
            return {
                name: t.recipient.firstname + " " + t.recipient.lastname,
                date: formateDate(t.createdAt),
                amount: t.amount,
                type: t.type,
                category: t.category
            }
        })

        return c.json({
            transactions: TransactionDetails
        });
    
    } catch(error) {
        console.error("Server-Side Error in Retrieving Transactions: ", error);
        return c.json({
            error: "Server-Side Error in Retrieving Transactions"
        }, 500)
    }
})


// type transferDetails = {
//     to: string,
//     amount: number,
//     pin: string,
//     category: TransactionCategory,
//     description? : string
// }  

transactionRouter.post('/decode/transaction', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: TransferType = await c.req.json()
        console.log(detail)
        const zodResult = await TransferSchema.safeParse(detail)
        if(!zodResult.success){
            return c.json({
                error: 'Invalid Format'
            }, 401)
        }

        const userId: string = c.get('userId')

        const response = await prisma.$transaction(async (tx) => {

            const from = await tx.user.findFirst({
                where: {
                    id: userId
                },
                select:{
                    firstname: true,
                    lastname: true
                }
            })

            if (!from) {
                return c.json({ message: "Sender User Does Not Exist" }, 404);
            }

            const userAccount = await tx.account.findFirst({
                where:{
                    userId: userId
                }
            })

            if (!userAccount) {
                return c.json({ message: "Sender Account Does Not Exist" }, 404);
            }
            
            if (userAccount.balance < detail.amount || detail.amount < 0) {
                return c.json({ message: "Insufficient Balance" }, 401);
            }

            const to = await tx.user.findFirst({
                where: {
                    id: userId
                },
                select:{
                    firstname: true,
                    lastname: true
                }
            })

            if (!to) {
                return c.json({ message: "Recipient User Does Not Exist" }, 404);
            }
            
            const toAccount = await tx.account.findFirst({
                where: { userId: detail.to },
            });
            
            if (!toAccount) {
                return c.json({ message: "Recipient Account Does Not Exist" }, 404);
            }


            const updateUser = await tx.account.update({
                where:{
                    userId: userId,
                    id: userAccount.id
                },
                data: {
                    balance: {
                        decrement: detail.amount
                    }
                }
            })
            
            const updateRecipient = await tx.account.update({
                where: {
                    userId: detail.to,
                    id: toAccount.id
                },
                data: {
                    balance: {
                        increment: detail.amount,
                    }
                },
                
            })
        
            const debitTx = await tx.transaction.create({
                data: {
                  accountId: userAccount.id,
                  recipientId: detail.to,
                  type: 'DEBIT',
                  amount: detail.amount,
                  category: detail.category || 'OTHER',
                  description: detail.description || '',
                },
              });

            const creditTx = await tx.transaction.create({
                data: {
                  accountId: toAccount.id,
                  recipientId: userId,
                  type: 'CREDIT',
                  amount: detail.amount,
                  category: detail.category || 'OTHER',
                  description: detail.description || '',
                },
              });

            const userNotify = await tx.notification.create({
                data: {
                  userId: userId,
                  name: `${to.firstname} ${to.lastname}`,
                  amount: detail.amount,
                  type: 'DEBIT',
                },
            });

            const recipientNotify = await tx.notification.create({
                data: {
                  userId: detail.to,
                  name: `${from.firstname} ${from.lastname}`,
                  amount: detail.amount,
                  type: 'CREDIT',
                },
            });

            return c.json({
                message: "Transaction successful"
            });

        })

        return c.json({
            message: response
        })

    } catch (error){
        console.error("Server-Side Error In Transfer: ", error)
        return c.json({
            error:"Server-Side Error In Transfer"
        }, 500)
    }

    
})


