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
import { z } from 'zod';

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

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
  lastname?: string,
  email:string,
  balance: number
}

const ResetPasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Password Must Be atleat 6 Characters Long'),
  newPassword: z.string().min(6, 'Password Must Be atleast 6 Characters Long'),
})

export default function Profile() {
  const [user, setUser] = useState<UserDetails>(
  {
    firstname: "",
    lastname: "",
    email: "",
    balance: 0
  }
);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
      const fetchDetails = async () => {
    
          try {
            const response = await axios.get(`${BACKEND_URL}/user/decode/userprofile`, {
              headers: { "Authorization": localStorage.getItem("token") }
            });

            console.log(response.data.user)
            
            setUser(response.data.user); 
            
          } catch (error) {
            console.error("Error in Fetching Profile Details: ", error);
            showSnackbar('Error in Fetching Profile Details', 'error');
          }
        };
    
        fetchDetails();
  }, [])


  async function handleUpdate() {
    try {
      await axios.post(`${BACKEND_URL}/user/decode/updateprofile`, {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      } , {
        headers: { "Authorization": localStorage.getItem("token") },
      })

      showSnackbar("Profile updated successfully!", "success");
      window.location.reload();

    } catch (error) {
      showSnackbar("Error updating profile.", "error");
      console.error('Error in Updating Profile: ', error)
    }
  }

  async function resetPass() {
    try {

      const parseData = ResetPasswordSchema.safeParse({ oldPassword, newPassword })
      if(!parseData.success){
        parseData.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
        return;
      }

      const response = await axios.post(`${BACKEND_URL}/user/decode/reset-pass`, 
        {
          oldPassword,
          newPassword
        } , {
          headers: { "Authorization": localStorage.getItem("token") },
        }
      )

      if(response.status === 200){
        showSnackbar("Password reset successfully!", "success");
      }
      else {
        showSnackbar(`${response.data.error}`, "error");
      }

    } catch (error) {
      showSnackbar("Error resetting password.", "error");
      console.error("Error in Reseting Password: ", error)
    }
  }
  

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '110vh',
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
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Profile
          </Typography>
          <Divider />
          <div className='m-8 flex gap-5 justify-center items-center'>
            <Avatar alt="User" src="/static/images/avatar/2.jpg" sx={{ width: 66, height: 66 }}>
              {user.firstname.charAt(0)}
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
            <TextField id="outlined-basic" label='First Name'onChange={(e) => setUser({ ...user, firstname: e.target.value })} value={user.firstname}  sx={{ marginBottom: 5, width: {xs:'100%', lg:'40%'}}} />
            <TextField id="outlined-basic" label="Last Name" onChange={(e) => setUser({ ...user, lastname: e.target.value})} value={user.lastname} variant="outlined"  sx={{ marginBottom: 5, width: {xs:'100%', lg:'40%'}}} />
          </div>
          <div className='flex justify-center items-center mx-6 md:mx-28'>
            <TextField id="outlined-basic" label="Email" onChange={(e) => ({...user, email: e.target.value})} value={user.email} variant="outlined" sx={{ marginBottom: 5, width:{xs:'100%', lg:'35%'}}} />
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
    </Box>
  );
}
