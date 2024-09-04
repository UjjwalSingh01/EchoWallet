import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OutlinedCard from '../component/GrpCard';
import AddMemberModel from '../component/AddMemberModel';
import AddGroupExpenseModal from '../component/AddGroupExpenseModal';

interface TransactionDetails {
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

const TripDetail = () => {
  const location = useLocation();
  const id = location.state;

  const [members, setMembers] = useState<MembersDetails[]>([
    {
      id: '1',
      name: 'John Doe'
    } , 
    {
      id: '2',
      name: 'Jane Edo'
    } ,
    {
      id: '3',
      name: 'Anje Ode'
    }
  ])

  const [groupDetail, setGroupDetail] = useState<TransactionDetails[]>([
    {
      name:'John Doe',
      paidBy: 'Doe John',
      date: 'Wed, Oct 25, 8:30 AM',
      share: 200,
      amount: 1000
    } ,
    {
      name:'John Doe',
      paidBy: 'Doe John',
      date: 'Wed, Oct 25, 8:30 AM',
      share: 200,
      amount: 1000
    }
  ])

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8787/api/v1/transaction/decode/get-group/${id}`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });

        setGroupDetail(response.data.TransactionDetails);
        setMembers(response.data.members)

      } catch (error) {
        console.error("Error in Fetching Details: ", error);
      }
    };

    fetchDetails();
  }, []);

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
      }}
    >
      <Card sx={{ 
          width: '80%',           
          height: '80%',          
          display: 'flex',        
          flexDirection: 'column',
          overflowY: 'auto',      // Enable vertical scrolling
          scrollbarWidth: 'none', // Hide scrollbar (Firefox)
          '&::-webkit-scrollbar': {
            display: 'none',      // Hide scrollbar (WebKit - Chrome, Safari)
          },
        }}>
        <CardContent>
          <div className='flex justify-center items-center px-4 sm:px-6 lg:px-8'>
            <Typography 
              sx={{ 
                fontSize: { xs: 24, sm: 32, md: 40, lg: 44 }, // Adjust font size based on screen size
                marginBottom: { xs: 2, sm: 3, md: 4 },       // Adjust margin bottom
                marginTop: { xs: 1, sm: 2, md: 3 },          // Adjust margin top
                marginLeft: { xs: 1, sm: 2, md: 3 },         // Adjust margin left
                textAlign: 'center'                          // Center text
              }} 
              color="text.secondary" 
              gutterBottom
            >
              Title
              <span className='text-base sm:text-lg'> Description of the Trips/Groups</span>
            </Typography>
          </div>

          <Divider />
          
          <div className='flex flex-col  sm:flex-row justify-evenly'>
            <div className='flex md:flex-row w-full  sm:w-1/2 my-5 justify-center items-center flex-col'>
              <OutlinedCard heading='Balance' amount={1000} />
              <OutlinedCard heading='Expenditure' amount={1000} />
            </div>
            <div className='flex flex-col justify-center my-5'>
              <AddMemberModel members={members} setMembers={setMembers} />
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
                </div>
                <Divider />
                </>
              ))}
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TripDetail