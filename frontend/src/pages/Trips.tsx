import Box from '@mui/material/Box';
import TripCard from '../component/TripCard';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface GroupDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  balance: number;
}

const Trips = () => {
  const [groups, setGroups] = useState<GroupDetails[]>([
    {
      id: '1',
      title: 'Trip 1',
      description: 'Goa',
      date: '24/11/23',
      balance: 5000,
    },
    {
      id: '2',
      title: 'Trip 2',
      description: 'Night Out',
      date: '24/11/24',
      balance: -1000,
    },
  ]);

  return (
    <Box
      sx={{
        display: 'flex',           // Enable flexbox
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
        height: '100vh',           // Full viewport height
        width: '100vw',            // Full viewport width
        boxSizing: 'border-box',   // Include padding in element's width and height
        padding: 2,                // Optional padding around the card
      }}
    >
      <Card
        sx={{
          width: '80%',           // Card takes 80% of the parent's width
          height: '80%',          // Card takes 80% of the parent's height
          display: 'flex',        // Ensure content is centered within the card
          flexDirection: 'column',
          overflowY: 'auto',      // Enable vertical scrolling
          scrollbarWidth: 'none', // Hide scrollbar (Firefox)
          '&::-webkit-scrollbar': {
            display: 'none',      // Hide scrollbar (WebKit - Chrome, Safari)
          },
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Trips
          </Typography>
          <Divider />
          {
            groups.map((group, index) => (
              // <div className='flex justify-center items-center w-full'>
                <Link to={`/Trips/${index}`} state={group.id}><TripCard key={group.id} data={group} /></Link>
              // </div>
            ))
          }
        </CardContent>
      </Card>
    </Box>
  );
}

export default Trips;
