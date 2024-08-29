import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const transactionRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
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
    const token = c.req.header("authorization") || "";
  
    try {
        const user: any = await verify(token, c.env.JWT_SECRET)
        c.set("userId", user.id);
  
        await next();
  
    } catch (err) {
        return c.json({
            message: "You Are Not Logged In"
        })
    }
})


type TransactionDetails = {
    name: string, 
    date: string,
    amount: number
}

transactionRouter.get('/decode/gettransaction', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId: string = c.get('userId');

        // Fetch transactions
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

        // Return the transactions with recipient details
        return c.json({
            transactions: TransactionDetails
        });


    
    } catch(error) {
        console.error("Server-Side Error in Getting Details: ", error);
    }
})


type transferDetails = {
    to_id: string,
    to_name: string,
    from_name: string,
    amount: number
}  

transactionRouter.post('/decode/transfer', async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: transferDetails = await c.req.json()
        console.log(detail)

        const response = await prisma.$transaction(async (tx) => {

            const userId: string = c.get('userId')

            const fromId = await tx.account.findFirst({
                where: {
                    userId: userId
                }
            })

            if(fromId === null){
                
                return c.json({
                    message: "User Does not Exist"
                })
            }

            if (fromId.balance < detail.amount || detail.amount < 0) {
                c.status(401);
                return c.json({
                    message: "Insufficient Balance"
                })
            }

            const sender = await tx.account.update({
                data: {
                    balance: {
                        decrement: detail.amount,
                    }, 
                    tt_debit: {
                        increment: detail.amount
                    }
                },
                where: {
                    id: fromId.id,
                },
            })
            
            const recipient = await tx.account.update({
                data: {
                    balance: {
                        increment: detail.amount,
                    },
                    tt_credit: {
                        increment: detail.amount
                    }
                },
                where: {
                    userId: detail.to_id,
                },
            })

            const date: string = generateDate();
        
            const Tx = await prisma.transaction.create({
                data: {
                    from_id: userId,
                    from_name: detail.from_name,
                    to_id: detail.to_id,
                    to_name: detail.to_name,
                    amount: detail.amount,
                    date: date
                }
            })

            // const recipientTx = await prisma.transaction.create({
            //     data:{
            //         userId: detail.to_id,
            //         to: userId,
            //         to_name: detail.from_name,
            //         amount: detail.amount,
            //         date: date
            //     }
            // })

            return c.json({
                message: Tx
            });
        })

        return c.json({
            message: response
        })

    } catch (error){
        console.error("Server-Side Error In Transfer: ", error)
    }

    
})


