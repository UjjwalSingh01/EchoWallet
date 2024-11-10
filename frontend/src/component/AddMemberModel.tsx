import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

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
  groupId: string
}

export default function AddGroupExpenseModal({ members, setMembers, groupId }: AddGroupExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MemberDetail[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/users`, {
          params: { searchTerm },
        });

        setSearchResults(response.data.user.map((user: { firstname: string; lastname: string; id: string }) => ({
          id: user.id,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        })));

      } catch (error) {
        showSnackbar('Error in Fetching Users', 'error');
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  async function handleSelectUser(user: MemberDetail) {
    try {
      if (!members.find((member) => member.id === user.id)) {
        setMembers([...members, user]);
      } else {
        setError('User is already added to the group.');
      }

      const response = await axios.post(`${BACKEND_URL}/trip/add-group-member`, {
        userId: user.id,
        groupId: groupId
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

    } catch(error){
      showSnackbar('Error in Adding Member', 'error');
      console.error("Error Adding Member: ", error);
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
