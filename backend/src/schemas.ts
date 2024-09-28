import { z } from 'zod'


// Register
const RegisterSchema = z.object({
    firstname: z.string().min(2, 'Firstname Must Contain atlest 2 characters'),
    lastname: z.string().optional(),
    email: z.string().email('Invalid Email Adress'),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
})

type RegisterType = z.infer<typeof RegisterSchema>


// Signin
const SignInSchema = z.object({
    email: z.string().email('Invalid Email Adress'),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

type SignInType = z.infer<typeof SignInSchema>


// Reset Pin 
const ResetPinSchema = z.object({
    oldPin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
    newPin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
})

type ResetPinType = z.infer<typeof ResetPinSchema>


// Reset Password
const ResetPasswordSchema = z.object({
    oldPassword: z.string().min(6, 'Password Must Be atleat 6 Characters Long'),
    newPassword: z.string().min(6, 'Password Must Be atleast 6 Characters Long'),
})

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>


// Transfer
const TransactionCategory = z.enum(['FOOD', 'SHOPPING', 'TRAVEL', 'OTHER']);

const TransferSchema = z.object({
    to: z.string(),
    amount: z.number().positive().int().min(1, 'Amount must be a positive number'),
    category: TransactionCategory,
    description: z.string().optional(),
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
})

type TransferType = z.infer<typeof TransferSchema>


// Group Transfer
const AddGroupTransactionSchema = z.object({
    pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
    description: z.string().nonempty("Description is required"),
    amount: z.number().positive("Amount must be positive"),
    groupId: z.string().nonempty("Group ID is required"),
    shares: z.record(
      z.string(), // The userId (key) must be a string
      z.number().min(0).positive("Share amount must be positive") // Each user's share (value) must be a positive number
    ).refine((shares) => Object.keys(shares).length > 0, {
      message: "Shares cannot be empty",
    }), // Custom validation to ensure the shares object is not empty
});

type AddGroupTransactionType = z.infer<typeof AddGroupTransactionSchema>


export {
    RegisterSchema,
    RegisterType,
    SignInSchema,
    SignInType,
    ResetPinSchema,
    ResetPinType,
    ResetPasswordSchema,
    ResetPasswordType,
    TransferSchema,
    TransferType,
    AddGroupTransactionSchema,
    AddGroupTransactionType,
}
