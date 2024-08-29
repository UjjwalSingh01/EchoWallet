import { Hono } from "hono";

export const tripsRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();

tripsRouter.get('/trips', async(c) => {
    
})