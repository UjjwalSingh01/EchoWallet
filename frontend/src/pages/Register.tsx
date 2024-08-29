import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


export default function Register() {

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleRegister() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/user/register', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      })

      localStorage.setItem("token", response.data.token)

      navigate('/dashboard')

    } catch (error) {
      console.error("Error in Register: ", error);
    }
  }

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">First name</label>
                <input onChange={(e) => {setFirstname(e.target.value)}} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Peter" required />
            </div>
            <div>
                <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Last name</label>
                <input onChange={(e) => {setLastname(e.target.value)}} type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Parker" required />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Email</label>
            <input onChange={(e) => {setEmail(e.target.value)}} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Peter@gmail.com" required />
          </div> 
          <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Password</label>
              <input onChange={(e) => {setPassword(e.target.value)}} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
          </div> 
          <div className="text-center">
            <button onClick={() => {handleRegister()}} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
            <p className="mt-4">Already have an account ? <Link to={'/'}>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

