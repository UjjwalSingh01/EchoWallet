import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import image from '../assets/Lofi Sunrise ♡.jpeg'

export default function Register() {

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState('')
  // const [pin, setPin] = useState('')

  const navigate = useNavigate()

  async function handleRegister() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/user/register', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        pin: pin
      })

      localStorage.setItem("token", response.data.token)

      navigate('/Dashboard')

    } catch (error) {
      console.error("Error in Register: ", error);
    }
  }

  return (
    <div className="bg-cover bg-center h-screen w-screen" style={{ backgroundImage: `url(${image})` }}>
      <div className="flex flex-col items-end justify-center px-6 py-8 mx-auto h-full lg:py-0">
        <div className="w-full max-w-md bg-white bg-opacity-70 rounded-lg shadow dark:border dark:bg-gray-800 dark:bg-opacity-70 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl dark:text-white">
              EchoWallet
            </h1>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register your account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div className="flex gap-5">
                <div>
                  <label htmlFor="First Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input onChange={(e)=>{setFirstname(e.target.value)}} type="First Name" name="First Name" id="First Name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                </div>
                <div>
                  <label htmlFor="Last Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input onChange={(e)=>{setLastname(e.target.value)}} type="Last Name" name="Last Name" id="Last Name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                <input onChange={(e)=>{setEmail(e.target.value)}} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="flex-col gap-2">
                <div>
                  <label htmlFor="Pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pin</label>
                  <input onChange={(e)=>{setPin(e.target.value)}} type="Pin" name="Pin" id="Pin" placeholder="••••••••" className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="Re-Enter Pin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Re-Enter Pin</label>
                  <input type="Re-Enter Pin" name="Re-Enter Pin" id="Re-Enter Pin" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
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
              <button type="submit" onChange={()=>{handleRegister()}} className="w-full bg-amber-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Register</button>
              <p className="flex justify-center items-center text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to='/' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

