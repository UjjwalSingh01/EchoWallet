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
import { useEffect, useState } from 'react';
import axios from 'axios';
import BasicModal from '../component/ProfileModal';

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


  async function handleUpdate() {
    try {
      // handle name, email
      // http://localhost:8787/api/v1/user/decode/updateprofile

      // setUser(response.data.user)

    } catch (error) {
      
    }
  }

  async function resetPass() {
    try {
      
      const response = await axios.post('http://localhost:8787/api/v1/user/decode/resetpass', 
        {
          oldPassword,
          newPassword
        } , {
          headers: { "Authorization": localStorage.getItem("token") },
        }
      )

      console.log(response.data.message)
      
    } catch (error) {
      console.error("Error in Reseting Password: ", error)
    }
  }
  

  return (
    <Box
      sx={{
        display: 'flex',           // Enable flexbox
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
        height: '105vh',           // Full viewport height
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
          <div className='flex gap-6 justify-around mx-20'>
            <TextField id="outlined-basic" label='First Name' defaultValue={user.firstname} variant="outlined"  sx={{ marginBottom: 5, width:'40%'}} />
            <TextField id="outlined-basic" label="Last Name" defaultValue={user.lastname} variant="outlined"  sx={{ marginBottom: 5, width:'40%'}} />
          </div>
          <div className='flex justify-center items-center'>
            <TextField id="outlined-basic" label="Email" defaultValue={user.email} variant="outlined"  sx={{ marginBottom: 5, width:'35%',}} />
          </div>
          <div className='flex justify-around items-center mb-10'>
            <Button onClick={() => {handleUpdate()}} variant="outlined">Update</Button>
            <BasicModal name="Add Balance" action="Add" />
            {/* <Button variant="outlined">Reset Pin</Button> */}
            <BasicModal name="Reset Pin" action="Reset" />
          </div>
          <Divider />
          <Typography sx={{ fontSize: 24, margin:3, }} color="text.secondary" gutterBottom>
            Reset Password
          </Typography>
          <div className='flex gap-6 justify-around mx-20'>
            <TextField onChange={(e) => {setOldPassword(e.target.value)}} id="outlined-basic" label="Old Password" variant="outlined"  sx={{ marginBottom: 5, width:'50%'}} />
            <TextField onChange={(e) => {setNewPassword(e.target.value)}} id="outlined-basic" label="New Password" variant="outlined"  sx={{ marginBottom: 5, width:'50%'}} />
          </div>
          <div className='flex justify-center items-center'>
            <Button onClick={()=>{resetPass()}} variant="outlined">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}