import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

const HelpSupport = () => {
    

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/detail/decode/get-group', {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        
        // setGroups(response.data.groups); 
        
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
          boxShadow: 6, // Enhanced shadow
          borderRadius: 3, // Rounded corners
          bgcolor: 'background.paper',
          '&:hover': {
            boxShadow: 12, // Shadow effect on hover
            transform: 'translateY(-5px)',
          },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          transition: 'box-shadow 0.3s ease, transform 0.3s ease', // Smooth transition
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Help & Support
          </Typography>
          <Divider sx={{ marginBottom: 3 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            {/* <BasicModal name='Add Group' action='Add' /> */}
          </Box>
          {/* {
            groups.map((group) => (
              <Link to={`/Trips/${group.id}`} state={group.id} style={{ textDecoration: 'none' }}>
                <TripCard key={group.id} data={group} />
              </Link>
            ))
          } */}
        </CardContent>
      </Card>
    </Box>
  );
}

export default HelpSupport;
