import { Hono } from "hono";
import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {
    getCookie,
    setCookie,
    deleteCookie,
} from 'hono/cookie'
import { RegisterSchema, RegisterType, ResetPasswordSchema, ResetPasswordType, ResetPinSchema, ResetPinType, SignInSchema, SignInType } from "../schemas";


export const userRouter = new Hono<{
	Bindings: {
        DATABASE_URL: string  
        JWT_SECRET: string
	},
    Variables: {
        userId: string;
    }
}>();



userRouter.post('/register', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: RegisterType = await c.req.json();
        // console.log(detail);

        const zodResult = RegisterSchema.safeParse(detail);
        if (!zodResult.success) {
            return c.json({
                error: "Invalid Format",
            }, 401);
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: detail.email,
            },
        });

        if (existingUser) {
            return c.json({
                error: "User already exists",
            }, 409);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(detail.password, saltRounds);
        const hashedPin = await bcrypt.hash(detail.pin, saltRounds);

        const user = await prisma.user.create({
            data: {
                firstname: detail.firstname,
                lastname: detail.lastname || "", 
                email: detail.email,
                password: hashedPassword,
                pin: hashedPin
            },
        });

        await prisma.account.create({
            data: {
                userId: user.id,
                balance: 0,
            },
        });

        // Generate a JWT token
        const payload = {
            id: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        }
        const token = await sign(payload, c.env.JWT_SECRET);

        return c.json({
            token: token,
            user: `${user.firstname} ${user.lastname}`
        }, 200);
        
    } catch (error) {
        console.error("Server-Side Error In Signup: ", error);
        return c.json({
            error: "An error occurred during sign-up",
        }, 500);
    }
})


userRouter.post('/login', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {

        const detail: SignInType = await c.req.json();
        const zodResult = SignInSchema.safeParse(detail)
        if(!zodResult.success){
            return c.json({
                error: "Invalid Format",
            }, 401);
        }

        const response = await prisma.user.findUnique({
            where: {
                email: detail.email,
            },
        })

        if(response === null){
            return c.json({
                error: "User Does not Exist"
            }, 401)
        }

        const isMatch = await bcrypt.compare(detail.password, response.password)
        if(!isMatch){
            return c.json({
                error: "Invalid Credentials"
            }, 401)
        }

        const payload = {
            id: response.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        }
        const token = await sign(payload, c.env.JWT_SECRET);

        return c.json({
            token: token,
            user: `${response.firstname} ${response.lastname}`
        }, 200)

    } catch (error) {
        console.error("Server Site error in Signin: ", error)
        return c.json({
            error: "Server Site error in Signin",
        }, 500);
    }
})


userRouter.use("/decode/*", async (c, next) => {
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
            error: "You Are Not Logged In"
        }, 403)
    }
})


userRouter.get('/users' , async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const searchTerm: string = c.req.query('searchTerm') || ""

        const users = await prisma.user.findMany({
            where: {
              OR: [
                {
                  firstname: {
                    contains: searchTerm,
                    mode: 'insensitive', //  case-insensitive search
                  },
                },
                {
                  lastname: {
                    contains: searchTerm,
                    mode: 'insensitive', 
                  },
                },
              ],
            }, 
            select:{
                id: true,
                firstname: true,
                lastname: true,
            }
        });

        return c.json({
            user: users
        }, 200)

    } catch(error) {
        console.error('Server-Side Error in Fetcing Users: ', error);
        return c.json({
            error: "Server-site Error in Retrievng Users"
        }, 500)
    }
})


userRouter.get('/decode/userprofile', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId');

        const userProfile = await prisma.user.findFirst({
            where:{
                id: userId
            },
            select:{
                firstname: true,
                lastname: true,
                email: true,
                accounts: {
                    select:{
                        balance: true
                    }
                }
            }
        })

        if(!userProfile){
            return c.json({
                error: 'User Does Not Exists'
            }, 404)
        }

        return c.json({
            user: { 
                firstname: userProfile.firstname, 
                lastname: userProfile.lastname,
                email: userProfile.email,
                balance: userProfile.accounts[0].balance
            }
        })

    } catch (error) {
        console.error("Server-site Error in Fetching Profile: ", error)
        return c.json({
            error: "Server-site Error in Retrieving Profile"
        }, 500)
    }
})



userRouter.post('/decode/addbalance', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const { balance }: { balance: number } = await c.req.json();

        const userId = c.get('userId');

        const user = await prisma.account.findFirst({
            where: {
                userId: userId
            },
            select: {
                id: true,
            }
        });

        if (!user) {
            return c.json({
                error: "Account Not Created"
            }, 404);
        }

        await prisma.account.update({
            where: {
                id: user.id
            },
            data: {
                balance: {
                    increment: balance
                }
            }
        });

        return c.json({
            message: "Balance Added"
        }, 200);

    } catch (error) {
        console.error("Server-side Error in Adding Balance: ", error);
        return c.json({
            error: "Server-side Error in Adding Balance"
        }, 500);
    }
});



userRouter.post('/decode/resetpin', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const detail: ResetPinType = await c.req.json();
        const zodResult = await ResetPinSchema.safeParse(detail);
        
        if (!zodResult.success) {
            return c.json({
                error: 'Pin Format Incorrect',
            }, 401);
        }

        const userId = c.get('userId');

        const response = await prisma.user.findFirst({
            where: { id: userId },
            select: { pin: true }
        });

        if (!response) {
            return c.json({ error: "User Not Found" }, 404);
        }

        const isMatch = await bcrypt.compare(detail.oldPin, response.pin);
        if (!isMatch) {
            return c.json({ error: "Invalid Old Pin" }, 401);
        }

        if (detail.oldPin === detail.newPin) {
            return c.json({
                error: "New Pin cannot be the same as the old pin"
            }, 400);
        }

        const saltRounds = 10;
        const hashedPin = await bcrypt.hash(detail.newPin, saltRounds);

        await prisma.user.update({
            where: { id: userId },
            data: { pin: hashedPin }
        });

        return c.json({ message: "Pin Reset Successful" });

    } catch (error) {
        console.error("Server-side Error in Resetting Pin: ", error);
        return c.json({
            error: "Server-side Error in Resetting Pin"
        }, 500);
    }
});



interface UpdateDetails {
    firstname: string,
    lastname?: string,
    email: string
}

userRouter.post('/decode/updateprofile', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: UpdateDetails = await c.req.json()

        const userId = c.get('userId');

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                firstname: detail.firstname,
                lastname: detail.lastname,
                email: detail.email
            },
            select:{
                firstname: true,
                lastname: true,
                email: true,
                accounts:{
                    select:{
                        balance:true
                    }
                }
            }
        })

        // const balance = user.accounts[0]

        return c.json({
            // user: {
            //     firstname: user.firstname,
            //     lastname: user.lastname,
            //     email: user.email,
            //     balance: balance.balance
            // }
            message: 'Profile Updated Successfully'
        }, 200)

    } catch (error) {
        console.error('Server-Site Error in Updating User: ', error)
        return c.json({
            error: "Server-site Error in Updating User"
        }, 500)
    }
})



userRouter.post('/decode/reset-pass', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: ResetPasswordType = await c.req.json();
        const zodResult = ResetPasswordSchema.safeParse(detail)
        if(!zodResult.success){
            return c.json({
                error: "Invalid Password format",
            }, 401);
        }

        const userId = c.get('userId')

        const response = await prisma.user.findFirst({
            where:{
                id : userId
            },
            select:{
                password: true
            }
        })

        if(response === null){
            return c.json({
                error: "User Does not Exist"
            }, 404)
        }

        const isMatch = await bcrypt.compare(detail.oldPassword, response.password)
        if(!isMatch){
            return c.json({
                error: "Invalid Credentials"
            }, 403)
        }

        const saltRounds = 10;
        const newHashedPassword = await bcrypt.hash(detail.newPassword, saltRounds);

        await prisma.user.update({
            where:{
                id: userId,
            }, 
            data: {
                password: newHashedPassword
            }
        })
        
        return c.json({
            message: "Password Reset Successful"
        }, 200)

    } catch(error){
        console.error("Server-site Error in Resetting Password: ", error)
        return c.json({
            error: "Server-site Error in Resetting Password"
        }, 500)
    }
})


// userRouter.post('/decode/logout', async (c) => {
    
// })



// Cross-Site Scripting (XSS) is a type of security vulnerability that allows an attacker to inject malicious scripts into web pages viewed by other users. 
// If an attacker can execute JavaScript on your website, they might try to steal cookies, including session cookies, to impersonate a user.


//  //  //  //  COOKIES   //  //  //  //
// Cookies are small pieces of data stored directly in the user's browser. They are included with every HTTP request to the server,
// allowing the server to identify users and maintain state across requests.


// app.use(cookieParser());

// res.cookie('session_id', '123456', {
//     httpOnly: true,
//     secure: true,
//     maxAge: 3600000, // 1 hour
//     sameSite: 'lax',
//   });

// // // httponly: true  { PREVENT XSS }
// httpOnly flag, it means that the cookie cannot be accessed or modified by JavaScript running in the browser
// Without httpOnly: If an attacker injects a script like alert(document.cookie); into a vulnerable web page, the script would display the cookies stored for that page
// inject to krlega prrr kuch hoga nahi

// // // secure: true
// The secure option ensures that the cookie is only sent over HTTPS, which encrypts the data and protects it from being intercepted.
// Set this to true for production environments to ensure cookies are only sent over secure connections. It should be false during local development unless you're using HTTPS locally.

// // // samesite: 'strict' .. 'lax' .. 'none'
// helps protect against CSRF (Cross-Site Request Forgery) attacks by controlling whether the browser sends the cookie with cross-site requests.


// SIGNED COOKIES ??


//  //  //  // SESSIONS  //  //  //  //
// A session is a way to store data on the server side that is associated with a particular user. 
// The session data is linked to the user by a session ID, which is stored in a cookie.
// Session data is stored on the server, and only the session ID is stored in the client-side cookie.
// This session ID is then sent with each HTTP request, allowing the server to retrieve the corresponding session data.
// This setup allows the server to manage user-specific data securely, without exposing it to the client, 
// while still maintaining a persistent state across multiple requests.

// app.use(session({
//     secret: 'your-secret-key',  // A secret key for signing the session ID cookie
//     resave: false,              // Prevents session from being saved back to the session store if it wasn't modified
//     saveUninitialized: false,   // Prevents uninitialized sessions from being saved
//     cookie: {
//       maxAge: 3600000,          // Sets session expiration time (1 hour in this case)
//       secure: true,             // Ensures cookies are only sent over HTTPS
//       httpOnly: true,           // Prevents client-side JavaScript from accessing the cookie
//       sameSite: 'strict',       // Helps prevent CSRF attacks
//     }
//  }));


// // // RESAVE
// This means that if a request is processed and no changes are made to the session data, the session will not be re-saved, which can reduce unnecessary operations on the session store.

// // // SAVEUNINITIALIZED
// saveUninitialized: false means that a session won’t be saved until something is stored in it, which can also improve performance by reducing the number of sessions saved to the store.

// //