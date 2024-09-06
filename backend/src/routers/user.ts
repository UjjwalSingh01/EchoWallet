import { Hono } from "hono";
import bcrypt from 'bcryptjs';
import zod from 'zod'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {
    getCookie,
    getSignedCookie,
    setCookie,
    setSignedCookie,
    deleteCookie,
} from 'hono/cookie'
import { RegisterSchema, RegisterType, ResetPasswordType, ResetPinSchema, ResetPinType, SignInSchema, SignInType } from "../schemas";


export const userRouter = new Hono<{
	Bindings: {
        DATABASE_URL: string  // to specify that Database_url is a string;
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
        console.log(detail);

        // Validate email using Zod schema
        const zodResult = RegisterSchema.safeParse(detail);
        if (!zodResult.success) {
            c.status(401);
            return c.json({
                message: "Invalid email format",
                errors: zodResult.error.errors,
            });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: detail.email,
            },
        });

        if (existingUser) {
            c.status(409);
            return c.json({
                message: "User already exists",
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(detail.password, saltRounds);

        // Create the new user
        const user = await prisma.user.create({
            data: {
                firstname: detail.firstname,
                lastname: detail.lastname || null, // Handle optional last name
                email: detail.email,
                password: hashedPassword,
                pin: detail.pin
            },
        });

        // Create an initial account for the user with zero balance
        const account = await prisma.account.create({
            data: {
                userId: user.id,
                balance: 0,
            },
        });

        // Generate a JWT token
        const token = sign({ id: user.id }, c.env.JWT_SECRET);

        // Return the response with token and user details
        c.status(200);
        return c.json({
            token: token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                // Exclude sensitive information like hashed password
            },
        });  
        
    } catch (error) {
        console.error("Server-Side Error In Signup: ", error);
        c.status(500);
        return c.json({
            message: "An error occurred during sign-up",
            error: error
        });
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
            c.status(401);
            return c.json({
                message: "Invalid email format",
                errors: zodResult.error.errors,
            });
        }

        const response = await prisma.user.findUnique({
            where: {
                email: detail.email,
            },
        })

        if(response === null){
            c.status(401)
            return c.json({
                message: "User Does not Exist"
            })
        }

        const isMatch = await bcrypt.compare(detail.password, response.password)
        if(!isMatch){
            c.status(401)
            return c.json({
                message: "Invalid Credentials"
            })
        }

        const token = await sign({ id: response.id }, c.env.JWT_SECRET);

        return c.json({
            message: token,
        })

    } catch (error) {
        console.error("Server Site error in Signin: ", error)
    }
})


userRouter.use("/decode/*", async (c, next) => {
    try {
        const token = c.req.header("authorization") || "";
        // console.log("middle ware called");

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


userRouter.get('/decode/users' , async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        // const userId = c.get('userId')
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
                lastname: true
            }
        });

        return c.json({
            user: users
        })

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
                email: true
            }
        })

        return c.json({
            user: userProfile
        })

    } catch (error) {
        console.error("Server-site Error in Fetching Profile: ", error)
        return c.json({
            error: "Server-site Error in Retrieving Profile"
        }, 500)
    }
})


userRouter.post('/decode/addbalance', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const balance: number = await c.req.json() ;

        const userId = c.get('userId');

        const user = await prisma.account.findFirst({
            where:{
                userId: userId
            },
            select:{
                id: true,
            }
        })

        if(user === null){
            return c.json({
                error: "Account Not Created"
            }, 404)
        }

        await prisma.account.update({
            where:{
                id: user.id
            },
            data:{
                balance: {
                    increment: balance
                }
            }
        })

        return c.json({
            message: "Balance Added"
        })

        
    } catch (error) {
        console.error("Server-site Error in Adding Balance: ", error)
        return c.json({
            error: "Server-site Error in Adding Balance"
        }, 500)
    }
})



userRouter.post('/decode/resetpin', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: ResetPinType = await c.req.json();
        const zodResult = await ResetPinSchema.safeParse(detail);
        if(!zodResult.success){
            return c.json({
                error: 'Pin Format Incorrect'
            }, 401)
        }

        const userId = c.get('userId')

        const response = await prisma.user.findFirst({
            where:{
                id : userId
            },
            select:{
                pin: true
            }
        })

        if(!response) {
            return c.json({
                error: "User Not Found"
            }, 404)
        }

        if(response.pin === detail.oldPin) {
            await prisma.user.update({
                where:{
                    id: userId,
                }, 
                data: {
                    password: detail.newPin
                }
            })

            return c.json({
                message: "Pin Reset Successful"
            })
    
        }
        else {
            return c.json({
                error: "Invalid Pin"
            }, 403)
        }
    
        
    } catch(error){
        console.error("Server-site Error in Resetting Pin: ", error)
        return c.json({
            error: "Server-site Error in Resetting Pin"
        }, 500)
    }
})


interface UpdateDetails {
    firstname: string,
    lastname: string,
    email: string
}

userRouter.post('/decode/updateprofile', async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const detail: UpdateDetails = await c.req.json()

        const userId = c.get('userId');

        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                firstname: detail.firstname,
                lastname: detail.lastname,
                email: detail.email
            }
        })

        // if(!updateUser){
        //     c.json({
        //         error: ""
        //     })
        // }

        return c.json({
            message: "User Credential Edited Successfully"
        })

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
        const zodResult = RegisterSchema.safeParse(detail)
        if(!zodResult.success){
            c.status(401);
            return c.json({
                message: "Invalid Password format",
                errors: zodResult.error.errors,
            });
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

        // Hash the password
        const saltRounds = 10;
        const newHashedPassword = await bcrypt.hash(detail.newPassword, saltRounds);

        const updatePassword = await prisma.user.update({
            where:{
                id: userId,
            }, 
            data: {
                password: newHashedPassword
            }
        })
        
        return c.json({
            message: "Password Reset Successful"
        })

    } catch(error){
        console.error("Server-site Error in Resetting Password: ", error)
        return c.json({
            error: "Server-site Error in Resetting Password"
        }, 500)
    }
})


userRouter.post('/decode/logout', async (c) => {
    
})



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