import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BasicModal from '../component/BasicModal';
import GroupCard from '../component/GroupCard';

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

interface GroupDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  balance: number;
}

const Trips = () => {
  const [groups, setGroups] = useState<GroupDetails[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/trip/decode/get-group`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        
        setGroups(response.data.groups); 
        
      } catch (error) {
        console.error("Error in Fetching Groups: ", error);
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
        padding: 3,
        // background: 'linear-gradient(135deg, #e0f7fa 30%, #b2dfdb 100%)', // Added gradient background
      }}
    >
      <Card
        sx={{
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
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Your Groups
          </Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <BasicModal name='Add Group' action='Add Group' />
          </Box>
          {
            groups.map((group) => (
              <GroupCard key={group.id} data={group} />
            ))
          }
        </CardContent>
      </Card>
    </Box>
  );
}

export default Trips;
