import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";

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
  // const [groupId, setGroupId] = useState('');
  const [shares, setShares] = useState<ShareDetails>({});
  const [error, setError] = useState<string | null>(null);

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
      await axios.post('your-api-endpoint', {
        description,
        amount,
        groupId,
        shares
      });
      setError(null);
      handleClose();
    } catch (error) {
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

          <Button onClick={handleSubmit} sx={{marginBottom:2, marginTop:3, width:"100%"}} variant="outlined">
            Add Expense
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
