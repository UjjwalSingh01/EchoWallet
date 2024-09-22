import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface data {
  name: string,
  action: string
}

export default function BasicModal(props: data) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const [oldPin, setOldPin] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  const [balance, setBalance] = React.useState(0)

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };


  async function handleClose(action: string) {
    
    try {
      if(action === "Reset"){
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/resetpin', {
            oldPin,
            newPin
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        if(response.status === 200){
          showSnackbar(`${response.data.message}`, 'success');
        }
        else {
          showSnackbar(`${response.data.error}`, 'error');
        }
      }

      else if(action === 'Add') {
        
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/addbalance',{
            balance
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        if(response.status === 200){
          showSnackbar(`${response.data.message}`, 'success');
        }
        else {
          showSnackbar(`${response.data.error}`, 'error');
        }

      }
      else if(action === 'Add Group'){
        const response = await axios.post('http://localhost:8787/api/v1/trip/decode/add-group', {
            title, 
            description
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        if(response.status === 200){
          showSnackbar(`${response.data.message}`, 'success');
        }
        else {
          showSnackbar(`${response.data.error}`, 'error');
        }

      }

    } catch (error) {
      showSnackbar('Error in ProfileModal', 'error');
      console.error("Error in ProfileModal: ", error)
    }
    
    setOpen(false)
  }

  return (
    <div>
      <Button sx={{ margin: 2 }} variant= {props.name==='Add Group' ? 'contained' : "outlined"} onClick={handleOpen}>{props.name}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography sx={{marginBottom:2, marginTop:2}} id="modal-modal-title" variant="h6" component="h2">
                {props.name}
            </Typography>
            {
              props.name === "Add Balance" ? (
                <>
                  <TextField
                    sx={{ width:"100%" }}
                    id="outlined-basic"
                    label={props.name}
                    variant="outlined"
                    onChange={(e) => { 
                      const accBalance = parseInt(e.target.value, 10);
                      setBalance(accBalance);
                    }}
                  />
                </>  
              ) :
              props.name === 'Reset Pin' ? (
                <>
                  <TextField
                    sx={{ width:"100%" }}
                    id="outlined-basic"
                    label="Old Pin"
                    variant="outlined"
                    onChange={(e) => { setOldPin(e.target.value) }}
                  />
                  <TextField
                    sx={{ width:"100%", marginTop:3 }}
                    id="outlined-basic"
                    label="New Pin"
                    variant="outlined"
                    onChange={(e) => { setNewPin(e.target.value) }}
                  />
                  
                </>  
              ) : (
                <>
                  <Typography sx={{marginBottom:2, marginTop:2}} id="modal-modal-title" variant="h6" component="h2">
                    Title
                  </Typography>
                  <TextField
                    id="outlined-textarea"
                    placeholder="Title"
                    multiline
                    variant="outlined"
                    onChange={(e) => { setTitle(e.target.value) }}
                  />
                  <Typography sx={{marginTop:3}} id="modal-modal-title" variant="h6" component="h2">
                    Description
                  </Typography>
                  <TextField
                    sx={{ width:"100%", marginTop:2 }}
                    id="outlined-textarea"
                    placeholder="Description"
                    multiline
                    variant="outlined"
                    onChange={(e) => { setDescription(e.target.value) }}
                  />
                  
                </>  
              )
            }
            <Button onClick={() => {handleClose(props.action)}} sx={{marginBottom:2, marginTop:3, width:"100%"}} variant="outlined">
              {props.action}
            </Button>
        </Box>
      </Modal>
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
    </div>
  );
}
