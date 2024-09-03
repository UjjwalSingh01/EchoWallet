import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import image from '../assets/Lofi Sunrise ♡.jpeg'


export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const response = await axios.get('http://localhost:8787/api/v1/user/login', {
        params: {
          email: email,
          password: password
        }
      })

      localStorage.setItem("token", response.data.message)

      navigate('/Dashboard')

    } catch (error) {
      console.error("Error in Login: " + error)
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
              Login your account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input onChange={(e)=>{setEmail(e.target.value)}} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
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
              <button onClick={()=>{handleLogin()}} type="submit" className="w-full bg-amber-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>
              <p className="flex justify-center items-center text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to='/register' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}



{/* <div className="text-white h-[100vh] flex justify-center items-center bg-cover" style={{'background':'url()'}}>
  login
</div> */}

{/* <div>
  <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
    <div>
      <input type="text" className="block w-72 py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600" />
      <label htmlFor="" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"></label>
    </div>
    <div>
      <input type="text" className="block w-72 py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600"/>
      <label htmlFor="" className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"></label>
    </div>
    <div className="flex justify-center items-center">
      <div className="flex gap-2 items-center">
        <input type="checkbox" />
        <label htmlFor="Remember Me"></label>
      </div>
      <span className="text-blue-500">Forgot Password?</span> // link
    </div>
    <button className="w-full md-4 text-[10px] mt-6 rounded-full bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">Login</button>
    <div>
      <span className="m-4">New Here? <Link className="text-blue-500" to='/Register'></Link></span>
    </div>
  </div>
</div> */}