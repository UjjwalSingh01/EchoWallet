import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Alert, Divider, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, useMediaQuery } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface GroupDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  balance: number;
}

export default function GroupCard({data} : {data: GroupDetails}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const navigate = useNavigate()

  async function onDelete() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/trip/decode/delete-group', {
        id: data.id
      }, {
        headers: { "Authorization": localStorage.getItem("token") },
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

      window.location.reload();
      navigate('/Groups')

    } catch (error) {
      showSnackbar('Error in Deleting Group', 'error');
      console.error('Error in Deleting Group: ', error)
    }
  }

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: isSmallScreen ? 'column' : 'row', // Change layout for small screens
        // width: '95%', 
        margin: 5, 
        boxShadow: 4, 
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ 
          width: isSmallScreen ? '100%' : 160, 
          display: { xs: 'none', sm: 'block' },
          borderRadius: '4px 0 0 4px',
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
        // image={data.image}
        // alt={data.title}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography component="h2" variant="h5" sx={{ color: 'primary.main' }}>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {data.date}
        </Typography>
        <Typography variant="subtitle1" paragraph sx={{ color: 'text.primary' }}>
          {data.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: data.balance > 0 ? 'green' : 'red' }}>
          Balance: ₹{Math.abs(data.balance)}
        </Typography>
        <Link to={`/Groups/${data.id}`} state={data.id} style={{ textDecoration: 'none' }}>Learn More</Link>
      </CardContent>
      
      {isSmallScreen ? (
        <>
          <Divider sx={{ width: '100%' }} /> 
          <Box display="flex" justifyContent="center" alignItems="center" my={1}>
            <DeleteIcon onClick={() => {onDelete()}} />
          </Box>
        </>
      ) : (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box display="flex" justifyContent="center" alignItems="center" m={3}>
            <DeleteIcon onClick={() => {onDelete()}} />
          </Box>
        </>
      )}
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
