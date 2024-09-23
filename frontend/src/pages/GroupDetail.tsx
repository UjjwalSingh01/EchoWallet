import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Divider , Snackbar, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddMemberModel from '../component/AddMemberModel';
import AddGroupExpenseModal from '../component/AddGroupExpenseModal';
import GrpCard from '../component/GrpAmountCard';
import DeleteIcon from '@mui/icons-material/Delete';

interface TransactionDetails {
  id: string;
  name: string;
  paidBy: string;
  date: string;
  share: number;
  amount: number;
}

export interface MembersDetails {
  id: string,
  name: string
}

interface AccountDetails {
  balance: number;
  totalExpenditure: number;
}

const TripDetail = () => {
  const location = useLocation();
  const id = location.state;

  const theme = useTheme();

  const [title, setTitle] = useState('Title')
  const [account, setAccount] = useState<AccountDetails>({
    balance: 0,
    totalExpenditure: 0
  })
  const [members, setMembers] = useState<MembersDetails[]>([])

  const [groupDetail, setGroupDetail] = useState<TransactionDetails[]>([])

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8787/api/v1/trip/decode/get-group/${id}`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });

        setGroupDetail(response.data.TransactionDetails);
        setMembers(response.data.members)
        setTitle(response.data.title)
        setAccount(response.data.account)

      } catch (error) {
        console.error("Error in Fetching Details: ", error);
      }
    };

    fetchDetails();
  }, []);

  async function onDelete(id: string) {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/trip/delete-group-transaction', {
        id: id
      }, {
        headers: { "Authorization": localStorage.getItem("token") }
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

    } catch (error) {
      showSnackbar('Error in Deleting Group Transaction', 'error');
      console.error('Error in Deleting Group Transaction: ', error)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        padding: 2,
        backgroundColor: theme.palette.background.default,           
      }}
    >
      <Card sx={{ 
           width: '80%',
           height: '80%',
           display: 'flex',
           flexDirection: 'column',
           overflowY: 'auto',
           boxShadow: 6,
           borderRadius: 3,
           bgcolor: 'background.paper',
           '&:hover': {
             boxShadow: 12,
             transform: 'translateY(-5px)',
           },
           scrollbarWidth: 'none',
           '&::-webkit-scrollbar': {
             display: 'none',
           },
           transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        }}>
        <CardContent>
          <div className='flex justify-center items-center px-4 sm:px-6 lg:px-8'>
            <Typography 
              sx={{ 
                fontSize: { xs: 24, sm: 32, md: 40, lg: 44 },
                marginBottom: { xs: 2, sm: 3, md: 4 },
                marginTop: { xs: 1, sm: 2, md: 3 },
                marginLeft: { xs: 1, sm: 2, md: 3 },
                textAlign: 'center'
              }} 
              color="text.secondary" 
              gutterBottom
            >
              {title}
              <span className='text-base sm:text-lg'> Description of the Trips/Groups</span>
            </Typography>
          </div>

          <Divider />
          
          <div className='flex flex-col  sm:flex-row justify-evenly'>
            <div className='flex md:flex-row w-full  sm:w-1/2 my-5 justify-center items-center flex-col'>
              <GrpCard heading='Balance' amount={account.balance} />
              <GrpCard heading='Expenditure' amount={account.totalExpenditure} />
            </div>
            <div className='flex flex-col justify-center my-5'>
              <AddMemberModel groupId={id} members={members} setMembers={setMembers} />
              <AddGroupExpenseModal members={members} groupId={id} />
            </div>
          </div>
          
          <Divider />
          <div className='text-xl mt-4 ml-4'>
            Transactions
          </div>

          <div className='flex-col py-4 mx-8 overflow-auto'>
            {groupDetail.map((group) => (
                <>
                <div className='flex justify-between px-2 my-2'>
                  <Typography>
                    <p className='text-md'>{group.name}</p>
                    <span className='text-sm text-slate-400'>{group.paidBy} <span className='text-xs'>{group.amount}</span></span>
                  </Typography>
                  <Typography sx={{alignContent:'end'}} >
                   {group.date}
                  </Typography>
                  <Typography sx={{alignContent:'end'}}>
                   {group.share}
                  </Typography> 
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <DeleteIcon onClick={() => {onDelete(group.id)}} />
                  </Box>
                </div>
                <Divider />
                </>
              ))}
          </div>
        </CardContent>
      </Card>
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
    </Box>
  )
}

export default TripDetail