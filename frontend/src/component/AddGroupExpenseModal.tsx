import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";
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

interface MemberDetail {
  id: string;
  name: string;
}

interface ShareDetails {
  [key: string]: number;
}

export default function AddGroupExpenseModal({ members, groupId }: { members: MemberDetail[], groupId: string }) {
  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [pin, setPin] = useState('')
  const [shares, setShares] = useState<ShareDetails>({});
  const [error, setError] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddShare = (id: string, value: number) => {
    setShares(prev => ({ ...prev, [id]: value }));
  };

  const validateShares = () => {
    const totalShares = Object.values(shares).reduce((a, b) => a + b, 0);
    return totalShares === amount;
  };

  const handleSubmit = async () => {
    if (!validateShares()) {
      setError("The sum of all shares must equal the total amount.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8787/api/v1/trip/decode/add-group-transaction', {
        description,
        amount,
        groupId,
        shares,
        pin
      });

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

      setError(null);
      handleClose();
    } catch (error) {
      showSnackbar('Error in AddGroupExpenseModal', 'error');
      console.error("Error in AddGroupExpenseModal: ", error);
    }
  };

  return (
    <div>
      <Button sx={{ margin: 2 }} variant="contained" onClick={handleOpen}>Add Expense</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{marginBottom:2, marginTop:2}} id="modal-modal-title" variant="h6" component="h2">
            Expense
          </Typography>

          <TextField
            sx={{ width:"100%", marginBottom: 2 }}
            id="description"
            label='Description'
            variant="outlined"
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            sx={{ width:"100%", marginBottom: 2 }}
            id="amount"
            label='Amount'
            variant="outlined"
            type="number"
            onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          />

          {members.map((member) => (
            <TextField
              key={member.id}
              sx={{ width:"100%", marginBottom: 2 }}
              id={`member-${member.id}`}
              label={member.name}
              variant="outlined"
              type="number"
              onChange={(e) => handleAddShare(member.id, parseInt(e.target.value, 10))}
            />
          ))}
          
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            id="outlined-basic"
            onChange={(e) => {setPin(e.target.value)}}
            label="Pin"
            variant="outlined"
            sx={{ marginBottom: 3, width: '100%' }}
          />

          <Button onClick={handleSubmit} sx={{marginBottom:2, marginTop:3, width:"100%"}} variant="outlined">
            Add Expense
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
