import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Divider, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Use percentage for responsive width
  maxWidth: 600, // Set a maximum width
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function SendMoneyModal({id}:{id: string}) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [pin, setPin] = React.useState("");
  const [category, setCategory] = React.useState("OTHER");
  const [description, setDescription] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  async function handleClose() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/user/decode/transaction', 
        {
          id,
          amount,
          pin,
          category,
          description 
        }, {
          headers: { "Authorization": localStorage.getItem("token") },
        }
      );

      console.log(response.data);
      
    } catch (error) {
      console.error("Error in Making Transaction: ", error);
    }

    setOpen(false);
  }

  return (
    <div>
      <Button onClick={handleOpen}>Send Money</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ marginBottom: 2, marginTop: 2 }} variant="h6" id="parent-modal-title">Send Money</Typography>

          <TextField
            onChange={(e) => { 
              const amt = parseInt(e.target.value, 10);
              setAmount(amt);
            }}
            id="outlined-basic"
            label="Amount"
            variant="outlined"
            sx={{ marginBottom: 3, width:'100%' }}
          />

          <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
            <FormLabel component="legend">Category</FormLabel>
            <RadioGroup
              row
              aria-label="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <FormControlLabel value="FOOD" control={<Radio />} label="Food" />
              <FormControlLabel value="SHOPPING" control={<Radio />} label="Shopping" />
              <FormControlLabel value="TRAVEL" control={<Radio />} label="Travel" />
            </RadioGroup>
          </FormControl>

          <TextField
            onChange={(e) => setDescription(e.target.value)}
            id="outlined-basic"
            label="Description (optional)"
            variant="outlined"
            multiline
            rows={2}
            sx={{ marginBottom: 3, width: '100%' }}
          />

          <Divider />

          <Typography sx={{ marginBottom: 2, marginTop: 2 }} variant="h6">Enter Pin</Typography>
          <TextField
            onChange={(e) => setPin(e.target.value)}
            id="outlined-basic"
            label="Pin"
            variant="outlined"
            sx={{ marginBottom: 3, width: '100%' }}
          />
          
          <Button variant="outlined" onClick={handleClose} sx={{ width: '100%' }}>Send</Button>
        </Box>
      </Modal>
    </div>
  );
}
