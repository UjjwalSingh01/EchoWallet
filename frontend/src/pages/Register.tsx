import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import image from '../assets/cover.webp';
import { z } from 'zod';
import { Alert, Snackbar } from "@mui/material";

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstname: z.string().min(2, 'Name Must Be at least 2 Characters long'),
  lastname: z.string().optional(),
  pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
});

export default function Register() {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function handleRegister() {
    try {
      if(pin !== confirmPin) {
        showSnackbar('Pins do not match', 'error');
        return;
      }

      const parsedData = await registerSchema.safeParse({ email, password, firstname, lastname, pin });
      if(!parsedData.success){
        parsedData.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
        return;
      }

      const response = await axios.post(`${BACKEND_URL}/user/register`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        pin: pin
      });

      if(response.status === 200){
        showSnackbar('User Registered Successfully!', 'success');

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);

        navigate('/Dashboard');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

    } catch (error) {
        showSnackbar('Error in User Registration', 'error');
        console.error("Error in Registration:", error);
    }
    
  }

  return (
    <div className="bg-cover bg-center h-svh w-full" style={{ backgroundImage: `url(${image})` }}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg dark:border dark:bg-gray-800 dark:bg-opacity-70 dark:border-gray-700 transform transition-all hover:scale-105 duration-300">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl dark:text-white animate-fade-in">
              EchoWallet
            </h1>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register your account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div className="flex gap-5">
                <div>
                  <label htmlFor="First Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input onChange={(e) => setFirstname(e.target.value)} type="text" name="First Name" id="First Name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" placeholder="John" required />
                </div>
                <div>
                  <label htmlFor="Last Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input onChange={(e) => setLastname(e.target.value)} type="text" name="Last Name" id="Last Name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" required />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="Pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pin</label>
                  <input onChange={(e) => setPin(e.target.value)} type="password" name="Pin" id="Pin" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" required />
                </div>
                <div>
                  <label htmlFor="Re-Enter Pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Re-Enter Pin</label>
                  <input onChange={(e) => setConfirmPin(e.target.value)} type="password" name="Re-Enter Pin" id="Re-Enter Pin" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white hover:shadow-lg transition-shadow duration-300" required />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button type="button" onClick={handleRegister} className="w-full bg-amber-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-all duration-300 ease-in-out transform hover:scale-105">
                Register
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          width: '400px', // Control width
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '0',
          '& .MuiSnackbarContent-root': {
            padding: 0, // Remove default padding
          },
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            background: snackbarSeverity === 'success'
              ? 'linear-gradient(90deg, rgba(70,203,131,1) 0%, rgba(129,212,250,1) 100%)'
              : 'linear-gradient(90deg, rgba(229,57,53,1) 0%, rgba(244,143,177,1) 100%)',
            color: '#fff', // Text color
            fontSize: '1.1rem', // Larger font
            fontWeight: 'bold', // Bold text
            borderRadius: '8px', // Rounded corners
            padding: '16px', // Padding inside Alert
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow
            width: '100%', // Take up the full Snackbar width
            '& .MuiAlert-icon': {
              fontSize: '28px', // Larger icon size
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
