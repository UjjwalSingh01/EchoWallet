import { Hono } from "hono";
import { PrismaClient, TransactionCategory } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { TransferSchema, TransferType } from "../schemas";
import bcrypt from 'bcryptjs';

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

transactionRouter.get('/decode/gettransaction', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const userId: string = c.get('userId');

        const account = await prisma.account.findFirst({
            where: {
                userId: userId,
            },
            select: { id: true }
        });

        if (!account) {
            return c.json({
                error: "Account not found",
            }, 404);
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                accountId: account.id, // Use the account ID instead of user ID
            },
        });

        if (transactions.length === 0) {
            return c.json({
                error: "No transactions found",
            }, 404);
        }

        async function getRecipientDetails(recipientId: string) {
            return prisma.user.findUnique({
                where: { id: recipientId },
                select: { firstname: true, lastname: true },
            });
        }

        const transactionsWithRecipientDetails = await Promise.all(transactions.map(async (transaction) => {
            const recipient = await getRecipientDetails(transaction.recipientId);
            return {
                ...transaction,
                recipient: recipient || { firstname: '', lastname: '' }, // Handle case where recipient is not found
            };
        }));

        const TransactionDetails = transactionsWithRecipientDetails.map(t => {
            return {
                name: t.recipient.firstname + " " + t.recipient.lastname,
                date: formateDate(t.createdAt),
                amount: t.amount,
                type: t.type,
                category: t.category
            };
        });


        return c.json({
            transactions: TransactionDetails
        });

    } catch (error) {
        console.error("Server-Side Error in Retrieving Transactions: ", error);
        return c.json({
            error: "Server-Side Error in Retrieving Transactions"
        }, 500);
    }
});




transactionRouter.post('/decode/transaction', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: TransferType = await c.req.json()
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
                    lastname: true,
                    pin: true
                }
            })


            if (!from) {
                return { error: "Sender User Does Not Exist", status: 404 };
            }

            const isMatch = await bcrypt.compare(detail.pin, from.pin);
            if (!isMatch) {
                return { error: "Invalid Pin", status: 401 };
            }

            const userAccount = await tx.account.findFirst({
                where:{
                    userId: userId
                }
            })

            if (!userAccount) {
                return { error: "Sender Account Does Not Exist", status: 404 };
            }

            if (userAccount.balance < detail.amount || detail.amount < 0) {
                return { error: "Insufficient Balance", status: 401 };
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
                return { error: "Recipient User Does Not Exist", status: 404 };
            }

            const toAccount = await tx.account.findFirst({
                where: { userId: detail.to }
            });

            if (!toAccount) {
                return { error: "Recipient Account Does Not Exist", status: 404 };
            }


            await tx.account.update({
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
            
            await tx.account.update({
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
        
            await tx.transaction.create({
                data: {
                  accountId: userAccount.id,
                  recipientId: detail.to,
                  type: 'DEBIT',
                  amount: detail.amount,
                  category: detail.category || 'OTHER',
                  description: detail.description || '',
                },
              });

            await tx.transaction.create({
                data: {
                  accountId: toAccount.id,
                  recipientId: userId,
                  type: 'CREDIT',
                  amount: detail.amount,
                  category: detail.category || 'OTHER',
                  description: detail.description || '',
                },
              });

            await tx.notification.create({
                data: {
                  userId: userId,
                  name: `${to.firstname} ${to.lastname}`,
                  amount: detail.amount,
                  type: 'DEBIT',
                },
            });

            await tx.notification.create({
                data: {
                  userId: detail.to,
                  name: `${from.firstname} ${from.lastname}`,
                  amount: detail.amount,
                  type: 'CREDIT',
                },
            });

            return { message: "Transaction successful", status: 200 };

        })

        if (response.error) {
            return c.json({ error: response.error }, { status: response.status });
        }

        return c.json({ message: response.message }, 200);

    } catch (error){
        console.error("Server-Side Error In Transfer: ", error)
        return c.json({
            error:"Server-Side Error In Transfer"
        }, 500)
    }
})


