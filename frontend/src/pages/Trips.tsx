import Box from '@mui/material/Box';
import TripCard from '../component/TripCard';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';


const Trips = () => {
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
      <Card sx={{ 
          width: '80%',           // Card takes 80% of the parent's width
          height: '80%',          // Card takes 80% of the parent's height
          display: 'flex',        // Ensure content is centered within the card
          flexDirection: 'column',
          
        }}>
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Trips
          </Typography>
          <Divider />
          <TripCard />
          <TripCard />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Trips