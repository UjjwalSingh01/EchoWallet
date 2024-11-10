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
import { Divider, useTheme } from '@mui/material';

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

interface NotificationType {
  name: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
};

export default function Notification() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/detail/decode/getnotifications`, {
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
          <Typography sx={{ fontSize: { xs: 30, md: 44 }, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.primary" gutterBottom>
            Notifications
          </Typography>

          <Divider />

          {notifications.map((notification, index) => (
            <Accordion defaultExpanded key={index} sx={{
              borderRadius: 2,
              marginBottom: 2,
              boxShadow: theme.shadows[2],
              transform: 'translateY(-5px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  backgroundColor: notification.type === "CREDIT" ? theme.palette.success.light : theme.palette.error.light,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: notification.type === "CREDIT" ? theme.palette.success.main : theme.palette.error.main,
                  },
                }}
              >
                <Typography>
                  {notification.type === "CREDIT" ? "Amount Credited" : "Amount Debited"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 2 }}>
                <Typography>
                  {notification.type === "CREDIT" ?
                     `${notification.name} has sent you ₹${notification.amount}`
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
