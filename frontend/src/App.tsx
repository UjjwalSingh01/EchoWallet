import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'
import Transaction from './pages/Transaction'
import Notification from './pages/Notification'
import Transfer from './pages/Transfer'
import Trips from './pages/Trips'
import Profile from './pages/Profile'
import Friends from './pages/Friends'
import CreditCard from './pages/CreditCard'


function App() {

  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <div className='flex'>
        <Sidebar />
      
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Transaction' element={<Transaction />} />
          <Route path='/Transfer' element={<Transfer />} />
          <Route path='/Trips' element={<Trips />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/Friends' element={<Friends />} />
          <Route path='/Credit Card' element={<CreditCard />} />
          <Route path='/Notification' element={<Notification />} />
        </Routes>
        </div>
      </BrowserRouter>
    </div>
      
  )
}

export default App
