import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import Transaction from './pages/Transaction';
import Notification from './pages/Notification';
import Transfer from './pages/Transfer';
import Trips from './pages/Group';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import CreditCard from './pages/CreditCard';
import TripDetail from './pages/GroupDetail';
import { useThemeContext } from "./theme/ThemeContextProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HelpSupport from './pages/HelpSupport';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });


function App() {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
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
            <Route path='/Groups' element={<Trips />} />
            <Route path='/Groups/:id' element={<TripDetail />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Friends' element={<Friends />} />
            <Route path='/Credit Card' element={<CreditCard />} />
            <Route path='/Notification' element={<Notification />} />
            <Route path='/Help & Support' element={<HelpSupport />} />
          </Routes>
        </div>
      </BrowserRouter>
     </ThemeProvider>
  );
}

export default App;
