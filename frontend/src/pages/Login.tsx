import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


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

      navigate('/dashboard')

    } catch (error) {
      console.error("Error in Login: " + error)
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="w-1/4">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Email</label>
            <input onChange={(e) => {setEmail(e.target.value)}} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Peter@gmail.com" required />
          </div> 
          <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Password</label>
              <input onChange={(e) => {setPassword(e.target.value)}} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
          </div> 
          <div className="text-center">
            <button onClick={() => {handleLogin()}} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
            <p className="mt-4">New User ? <Link to={'/register'}>Register</Link></p>
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