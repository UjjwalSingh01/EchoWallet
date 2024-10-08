import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Alert, Button, CardActionArea, CardActions, Snackbar } from '@mui/material';
import SendMoneyModal from './SendModal';
import image from '../assets/profile.jpg';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

interface Friend {
  id: string;
  firstname: string;
  lastname?: string;
}

export default function FriendCard({ data }: { data: Friend }) {
  const theme = useTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function RemoveFriend() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/detail/decode/removefriend', {
        id: data.id
      }, {
        headers: { "Authorization": localStorage.getItem("token") }
      });

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

    } catch (error) {
      showSnackbar('Error in Removing Friend', 'error');
      console.error('Error in Removing Friend: ', error);
    }
  }

  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        mb: 2,
        borderRadius: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
        // border: `2px solid ${theme.palette.background.default}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: '100%', sm: 100 },
            height: { xs: 100, sm: 'auto' },
            objectFit: 'cover',
            borderRadius: 2,
          }}
          image={image}
          alt="friend"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.firstname} {data.lastname}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: "flex", flexDirection: 'column', justifyContent: "space-between", p: 2 }}>
        <SendMoneyModal id={data.id} />
        <Button onClick={() => { RemoveFriend() }} variant="outlined" sx={{ marginTop: 2 }}>
          Remove
        </Button>
      </CardActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          width: '400px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '0',
          '& .MuiSnackbarContent-root': {
            padding: 0,
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
            color: '#fff', 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            width: '100%', 
            '& .MuiAlert-icon': {
              fontSize: '28px', 
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
