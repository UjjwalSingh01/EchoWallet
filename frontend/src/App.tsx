import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import Desktop from './pages/LandingPage';

// Component to conditionally render Sidebar and Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Paths where Sidebar & Navbar should NOT appear
  const hideLayout = ['/', '/register', '/login'].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />} {/* Navbar hidden on Login and Register pages */}
      <div className="flex">
        {!hideLayout && <Sidebar />} {/* Sidebar hidden on Login and Register pages */}
        {children} {/* Render child routes */}
      </div>
    </>
  );
};

// function App() {
//   const { theme } = useThemeContext();
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <BrowserRouter>
//         <Layout>
//           <Routes>
//             <Route path='/' element={<Login />} />
//             <Route path='/register' element={<Register />} />
//             <Route path='/Dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/' />} />
//             <Route path='/Transaction' element={isAuthenticated ? <Transaction /> : <Navigate to='/' />} />
//             <Route path='/Transfer' element={isAuthenticated ?<Transfer /> : <Navigate to='/' />} />
//             <Route path='/Groups' element={isAuthenticated ?<Trips /> : <Navigate to='/' />} />
//             <Route path='/Groups/:id' element={isAuthenticated ?<TripDetail /> : <Navigate to='/' />} />
//             <Route path='/Profile' element={isAuthenticated ?<Profile /> : <Navigate to='/' />} />
//             <Route path='/Friends' element={isAuthenticated ?<Friends /> : <Navigate to='/' />} />
//             <Route path='/CreditCard' element={<CreditCard />} />
//             <Route path='/Notification' element={isAuthenticated ? <Notification /> : <Navigate to='/' />} />
//             <Route path='/Help & Support' element={<HelpSupport />} />
//           </Routes>
//         </Layout>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }




function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Desktop />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Transaction' element={<Transaction /> } />
            <Route path='/Transfer' element={<Transfer />} />
            <Route path='/Groups' element={<Trips />} />
            <Route path='/Groups/:id' element={<TripDetail />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Friends' element={<Friends />} />
            <Route path='/CreditCard' element={<CreditCard />} />
            <Route path='/Notification' element={<Notification />} />
            <Route path='/Help & Support' element={<HelpSupport />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;