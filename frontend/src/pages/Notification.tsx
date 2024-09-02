import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the type for a notification
type NotificationType = {
  name: string;
  amount: number;
  type: string
};

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      name:"John Doe",
      amount: 500,
      type:"DEBIT"
    } , {
      name: "John Doe",
      amount: 500,
      type: "CREDIT"
    }
  ]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/detail/decode/getnotifications', {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        
        setNotifications(response.data.notification); 
        
      } catch (error) {
        console.error("Error in Fetching Notification: ", error);
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
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
        <CardContent sx={{padding:4}}>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Notifications
          </Typography>
          
          {/* Map through the notifications array */}
          {notifications.map((notification, index) => (
            <Accordion key={index} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>
                  {notification.type === "CREDIT" ? "Amount Credited" : "Amount Debited"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {notification.type === "CREDIT" 
                    ? `${notification.name} has sent you ₹${notification.amount}` 
                    : `You sent ${notification.name} ₹${notification.amount}`
                  }
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
