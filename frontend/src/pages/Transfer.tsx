import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddReactionRoundedIcon from '@mui/icons-material/AddReactionRounded';
import ReactPaginate from 'react-paginate';
import { IconButton, Avatar, Divider, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SendMoneyModal from '../component/SendModal';

interface User {
  id: string,
  name: string
}

export default function Transfer() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: "John Doe",
    },
    {
      id: '2',
      name: "King Slayer",
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedIcons, setClickedIcons] = useState<{ [key: string]: boolean }>({});
  const usersPerPage = 10;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/user/users', {
          params: { searchTerm }
        });

        setUsers(response.data.user.map((user: { firstname: string; lastname: string; id: string }) => ({
          id: user.id,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        })));
        
        console.log(response.data.user)

      } catch (error) {
        showSnackbar("Error fetching users:", 'error');
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  async function handleAddClick(id: string) {

    try {
      console.log(id)

      const response = await axios.post('http://localhost:8787/api/v1/detail/decode/addfriend', {
        id: id
      }, {
        headers: { "Authorization": localStorage.getItem("token") },
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

      setClickedIcons(prevState => ({
        ...prevState,
        [id]: true,
      }));

    } catch (error) {
      showSnackbar('Error in Adding Friend', 'error');
      console.error('Error in Adding Friend: ', error)
    }
  };

  // const displayedUsers = Array.isArray(users)
  //   ? users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage)
  //   : [];
  const displayedUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
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
        boxShadow: 6,
        borderRadius: 3,
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 12,
          transform: 'translateY(-5px)',
        },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}>
        <CardContent sx={{ padding: '24px' }}>
          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 3
            }}
            gutterBottom
          >
            Users
          </Typography>
          <TextField
            label="Search Users"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              marginBottom: 4,
            }}
          />
          <Box className="w-full flex flex-col items-center">
            {displayedUsers.map(user => (
              <Card
                key={user.id}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Avatar sx={{ bgcolor: '#3f51b5', marginRight: 2 }}>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                  }
                </Avatar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {user.name}
                </Typography>
                <Box sx={{ justifyContent:'center', alignItems:'center'}}>
                  {!clickedIcons[user.id] && (
                    <IconButton color="primary" onClick={() => handleAddClick(user.id)} sx={{ marginRight: {md:'none', lg:1} }}>
                      <AddReactionRoundedIcon />
                    </IconButton>
                  )}
                  <span>
                    <SendMoneyModal id={user.id} />
                  </span>
                </Box>
              </Card>
            ))}
          </Box>
          <Divider sx={{ marginY: 4 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4,
              '& .pagination': {
                display: 'flex',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              },
              '& .page-item': {
                margin: '0 8px',
              },
              '& .page-link': {
                padding: '8px 16px',
                textDecoration: 'none',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333',
                transition: 'background-color 0.3s, color 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              },
              '& .active .page-link': {
                backgroundColor: '#3f51b5',
                color: 'white',
                borderColor: '#3f51b5',
              },
              '& .prev-next': {
                padding: '8px 20px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                },
              },
            }}
          >
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(users.length / usersPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="prev-next"
              nextClassName="prev-next"
              breakClassName="page-item"
              activeClassName="active"
            />
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
