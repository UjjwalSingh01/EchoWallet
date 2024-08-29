import { PrismaClient, TransactionCategory } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const detailRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();


detailRouter.use("/decode/*", async (c, next) => {
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



detailRouter.get('/decode/getnotifications', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId: string = c.get('userId')

        const notification = await prisma.notification.findMany ({
            take: 10,
            where: {
                userId: userId
            },
            select: {
                name: true,
                amount: true,
                type: true
            }
        })

        return c.json({
            notification: notification
        })

    } catch (error) {
        console.error("Server-Site Error in Getting Notification: ", error)
    }
})


detailRouter.get('/decode/getfriends', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId: string = c.get('userId');

        // Find all friends of the user
        const friendsResponse = await prisma.friend.findMany({
            where: {
                userId: userId
            },
            select: {
                friendId: true
            }
        });

        // Extract friendIds
        const friendIds = friendsResponse.map(friend => friend.friendId);

        // Find user details for all friends
        const friendsDetails = await prisma.user.findMany({
            where: {
                id: { in: friendIds } // Assuming the primary key for users is `id`
            },
            select: {
                id: true,
                firstname: true,
                lastname: true
            }
        });

        return c.json({
            friends: friendsDetails
        });

    } catch (error) {
        console.error("Server-Side Error in Getting Friends: ", error);
        return c.json({ error: "An error occurred while retrieving friends." });
    }
});



type AddFriendDetail = {
    friendId: string,
}

detailRouter.post('/decode/addfriend', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const details: AddFriendDetail = await c.req.json(); // Ensure to await the JSON parsing
        const userId: string = c.get('userId');

        // Add friend relationship
        const response = await prisma.friend.create({
            data: {
                userId: userId,
                friendId: details.friendId,
            }
        });

        return c.json({
            success: true,
            message: 'Friend added successfully',
            response
        });

    } catch (error) {
        console.error("Server-Side Error in Adding Friends: ", error);
        return c.json({ error: "An error occurred while adding friend." });
    }
});



detailRouter.get('/decode/dashboardDetails', async (c) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL
            }
        }}).$extends(withAccelerate());

    try {
        const userId: string = c.get('userId'); // Ensure userId is fetched correctly

        // User Balance
        const userBalance = await prisma.account.findFirst({
            where: { userId },
            select: { balance: true },
        });

        // Current Month Start and End Dates
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // Current Month Credit and Debit
        const currentMonthTransactions = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                account: { userId },
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                // status: 'COMPLETED',
            },
            _sum: { amount: true },
        });

        const currentMonthCredit = currentMonthTransactions.find(t => t.type === 'CREDIT')?._sum.amount || 0;
        const currentMonthDebit = currentMonthTransactions.find(t => t.type === 'DEBIT')?._sum.amount || 0;

        // Current Month Expenditures by Category
        const categories: TransactionCategory[] = [
            TransactionCategory.FOOD,
            TransactionCategory.SHOPPING,
            TransactionCategory.TRAVEL,
            TransactionCategory.OTHER
        ];

        const categoryExpenditures = await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                account: { userId },
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                type: 'DEBIT',
                // status: 'COMPLETED',
                category: { in: categories },
            },
            _sum: { amount: true },
        });

        const foodExpenditure = categoryExpenditures.find(c => c.category === TransactionCategory.FOOD)?._sum.amount || 0;
        const shoppingExpenditure = categoryExpenditures.find(c => c.category === TransactionCategory.SHOPPING)?._sum.amount || 0;
        const travelExpenditure = categoryExpenditures.find(c => c.category === TransactionCategory.TRAVEL)?._sum.amount || 0;
        const otherExpenditure = categoryExpenditures.find(c => c.category === TransactionCategory.OTHER)?._sum.amount || 0;


        // Past 6 Months Expenditure Details
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const pastSixMonthsExpenditures = await prisma.transaction.findMany({
            where: {
                account: { userId },
                createdAt: { gte: sixMonthsAgo },
                type: 'DEBIT',
                // status: 'COMPLETED',
            },
            orderBy: { createdAt: 'asc' },
        });

        // Define the type for the accumulator object
        type ExpendituresByMonth = {
            [key: string]: number; // The key is a string (month-year) and the value is a number (sum of amounts)
        };

        const expendituresByMonth: ExpendituresByMonth = pastSixMonthsExpenditures.reduce((acc: ExpendituresByMonth, transaction) => {
            const month = transaction.createdAt.getMonth() + 1; // Extract month from createdAt, make it 1-indexed
            const year = transaction.createdAt.getFullYear(); // Extract year from createdAt
            const key = `${year}-${month.toString().padStart(2, '0')}`; // Create a key for each month-year

            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += transaction.amount; // Sum the amounts for each month
            return acc;
        }, {} as ExpendituresByMonth);

        console.log(expendituresByMonth);

        const data = Object.keys(expendituresByMonth).map((key) => ({
            name: key, // The month-year string
            value: expendituresByMonth[key], // The summed amount for that month-year
          }));
          
        console.log(data);

        // return c.json({
        //     balance: userBalance?.balance || 0,
        //     currentMonthCredit,
        //     currentMonthDebit,
        //     foodExpenditure,
        //     shoppingExpenditure,
        //     travelExpenditure,
        //     expendituresByMonth,
        // });

        return c.json({
            account: { userBalance, currentMonthCredit, currentMonthDebit },
            pieData: { foodExpenditure, shoppingExpenditure, travelExpenditure, otherExpenditure },
            barData: data
        })

    } catch (error) {
        console.error("Server-Side Error in Getting Details: ", error);
        return c.json({ error: "An error occurred while retrieving details." }); // Return an error response
    }
});
