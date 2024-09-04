import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState, useEffect } from "react";

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

interface AddGroupExpenseModalProps {
  members: MemberDetail[];
  setMembers: (members: MemberDetail[]) => void;
}

export default function AddGroupExpenseModal({ members, setMembers }: AddGroupExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MemberDetail[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/your-api-endpoint', {
          params: { searchTerm },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user: MemberDetail) => {
    if (!members.find((member) => member.id === user.id)) {
      setMembers([...members, user]);
    } else {
      setError('User is already added to the group.');
    }
  };

  return (
    <div>
      <Button sx={{ margin: 2 }} variant="contained" onClick={handleOpen}>Add Members</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ marginBottom: 2, marginTop: 2 }} id="modal-modal-title" variant="h6" component="h2">
            Add Members
          </Typography>

          <TextField
            sx={{ width: "100%", marginBottom: 2 }}
            id="search"
            label='Search Users'
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchResults.map((user) => (
            <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
              <Typography>{user.name}</Typography>
              <Button variant="outlined" onClick={() => handleSelectUser(user)}>
                Add
              </Button>
            </Box>
          ))}

          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          <Button onClick={handleClose} sx={{ marginBottom: 2, marginTop: 3, width: "100%" }} variant="outlined">
            Done
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
