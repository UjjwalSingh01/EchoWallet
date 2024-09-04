import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import FriendCard from '../component/FriendCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface FriendDetail { 
  id: string,
  firstname: string,
  lastname?: string 
};

const Friends = () => {
  const [friends, setFriends] = useState<FriendDetail[]>([
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe'
    }, 
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe'
    },
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe'
    },
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe'
    }
  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/detail/decode/getfriends', {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        setFriends(response.data.friends); 
      } catch (error) {
        console.error("Error in Fetching Friends: ", error);
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
          width: { xs: '100%', sm: '90%', md: '80%' }, 
          height: '80%', 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
        <CardContent>
          <Typography 
            sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} 
            color="text.secondary" 
            gutterBottom
          >
            Friends
          </Typography>
          <Divider />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-4'>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <FriendCard key={index} data={friend} />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No friends found.
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Friends;
