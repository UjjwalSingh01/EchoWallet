import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import BasicModal from '../component/BasicModal';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


interface UserDetails {
  firstname: string,
  lastname: string,
  email:string
}

export default function Profile() {
  const [user, setUser] = useState<UserDetails>({
    firstname: "John",
    lastname: "Doe",
    email: "jd@gmail.com"
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");


  useEffect(() => {
      const fetchDetails = async () => {
    
          try {
            const response = await axios.get('http://localhost:8787/api/v1/user/decode/userprofile', {
              headers: { "Authorization": localStorage.getItem("token") }
            });
            
            setUser(response.data.user); 
            
          } catch (error) {
            console.error("Error in Fetching Notification: ", error);
          }
        };
    
        fetchDetails();
    }, [])

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };


  async function handleUpdate() {
    try {
      // handle name, email
      const response = await axios.post('http://localhost:8787/api/v1/user/decode/updateprofile', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      } , {
        headers: { "Authorization": localStorage.getItem("token") },
      })

      showSnackbar("Profile updated successfully!", "success");
      setUser(response.data.user)

    } catch (error) {
      showSnackbar("Error updating profile.", "error");
      console.error('Error in Updating Profile: ', error)
    }
  }

  async function resetPass() {
    try {
      
      const response = await axios.post('http://localhost:8787/api/v1/user/decode/reset-pass', 
        {
          oldPassword,
          newPassword
        } , {
          headers: { "Authorization": localStorage.getItem("token") },
        }
      )

      showSnackbar("Password reset successfully!", "success");
      console.log(response.data.message)
      
    } catch (error) {
      showSnackbar("Error resetting password.", "error");
      console.error("Error in Reseting Password: ", error)
    }
  }
  

  return (
    <Box
      sx={{
        display: 'flex',           // Enable flexbox
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
        height: '110vh',           // Full viewport height
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
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Profile
          </Typography>
          <Divider />
          <div className='m-8 flex gap-5 justify-center items-center'>
            <Avatar alt="User" src="/static/images/avatar/2.jpg" sx={{ width: 66, height: 66 }}>
              {user.firstname.charAt(0)}{user.lastname.charAt(0)}
            </Avatar>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
                Upload Photo
              <VisuallyHiddenInput type="file" />
            </Button>
          </div>
          <div className='flex flex-col md:flex-row md:gap-6 justify-around mx-6 lg:mx-20'>
            <TextField id="outlined-basic" label='First Name' onChange={(e) => {user.firstname = e.target.value}} defaultValue={user.firstname} variant="outlined"  sx={{ marginBottom: 5, width: {xs:'100%', lg:'40%'}}} />
            <TextField id="outlined-basic" label="Last Name" onChange={(e) => {user.lastname = e.target.value}} defaultValue={user.lastname} variant="outlined"  sx={{ marginBottom: 5, width: {xs:'100%', lg:'40%'}}} />
          </div>
          <div className='flex justify-center items-center mx-6 md:mx-28'>
            <TextField id="outlined-basic" label="Email" onChange={(e) => {user.email = e.target.value}} defaultValue={user.email} variant="outlined"  sx={{ marginBottom: 5, width:{xs:'100%', lg:'35%'}}} />
          </div>
          <div className='flex flex-col md:flex-row justify-around items-center mb-10'>
            <Button onClick={() => {handleUpdate()}} variant="outlined">Update</Button>
            <BasicModal name="Add Balance" action="Add" />
            <BasicModal name="Reset Pin" action="Reset" />
          </div>
          <Divider />
          <Typography sx={{ fontSize: 24, margin:3, }} color="text.secondary" gutterBottom>
            Reset Password
          </Typography>
          <div className='flex flex-col md:flex-row md:gap-6 justify-around mx-6 lg:mx-20'>
            <TextField onChange={(e) => {setOldPassword(e.target.value)}} id="outlined-basic" label="Old Password" variant="outlined"  sx={{ marginBottom: 5, width: {xs:'100%', lg:'50%'}}} />
            <TextField onChange={(e) => {setNewPassword(e.target.value)}} id="outlined-basic" label="New Password" variant="outlined"  sx={{ marginBottom: 5, width: {xs:'100%', lg:'50%'}}} />
          </div>
          <div className='flex justify-center items-center'>
            <Button onClick={()=>{resetPass()}} variant="outlined">Reset</Button>
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          width: '400px', // Control width
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '0',
          '& .MuiSnackbarContent-root': {
            padding: 0, // Remove default padding
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
            color: '#fff', // Text color
            fontSize: '1.1rem', // Larger font
            fontWeight: 'bold', // Bold text
            borderRadius: '8px', // Rounded corners
            padding: '16px', // Padding inside Alert
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow
            width: '100%', // Take up the full Snackbar width
            '& .MuiAlert-icon': {
              fontSize: '28px', // Larger icon size
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
