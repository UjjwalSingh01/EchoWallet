import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Button, Divider, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';


const querySchema = z.string().min(6, 'Query Must Be Atleast 6 Characters Long')


const HelpSupport = () => {
  const [query, setQuery] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };


  async function SubmitQuery() {
    try {
      const parseData = await querySchema.safeParse(query);
      
      if (!parseData.success) {
        showSnackbar(`Validation Error`, "error");
        console.error("Validation Error: ", parseData.error.errors);
        return; 
      }
  
      await axios.post('http://localhost:8787/api/v1/detail/query', {
        query: parseData.data 
      });

      showSnackbar("Query Added successfully!", "success");
      setQuery("")
  
    } catch (error) {
      showSnackbar("Error Adding Query.", "error");
      console.error("Error Adding Query: ", error)
    }
  }
  

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
              marginTop: 10,
              flexDirection:'column',
              gap: 4
            }}
          >
      
            <TextField
              id="outlined-textarea"
              label="Add Query"
              placeholder="Query"
              multiline
              sx={{
                width: "50%",
                alignSelf: "center"
              }}
              onChange={(e)=>{setQuery(e.target.value)}}
            />

            <Button variant='contained' sx={{width:'30%', alignSelf:'center'}} onClick={() => {SubmitQuery()}}>Add Query</Button>
            
          </Box>
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

export default HelpSupport;
