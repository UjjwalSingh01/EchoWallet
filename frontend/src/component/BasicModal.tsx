import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";

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

  async function handleClose(action: string) {
    
    try {
      if(action === "Reset"){
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/resetpin', 
          {
            oldPin,
            newPin
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        console.log(response.data.message)
      }

      else if(action === 'Add') {
        // add balance
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/addbalance', 
          {
            balance
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        console.log(response.data.message)
      }
      else {
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/add-group', 
          {
            title, 
            description
          } , {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        )

        console.log(response.data.message)
      }

    } catch (error) {
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
    </div>
  );
}



// Add Group .. title & description 
// Add Member .. select m search & add members
// Add Grp Tn Detail .. description & amount & groupId & shares among members