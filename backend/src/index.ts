import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routers/user';
import { transactionRouter } from './routers/transactions';
import { groupRouter } from './routers/group';
import { detailRouter } from './routers/detail';

const app = new Hono()

app.use('*', cors({
    origin: 'https://echowallet.netlify.app',
}));

app.route("api/v1/user", userRouter)
app.route("api/v1/transaction", transactionRouter)
app.route("api/v1/trip", groupRouter)
app.route("api/v1/detail", detailRouter)

export default app




// COOKIES

// const token: string = sign({ id: user.id }, c.env.JWT_SECRET);

// setCookie(c, 'token', token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: 'lax',
//     maxAge: 60 * 60 * 24, // 1 day
// });

// GET COOKIE IN /decode/* and extract userId
// const token = await getCookie(c, 'token')

// AT LOGOUT
// deleteCookie(c, 'token')