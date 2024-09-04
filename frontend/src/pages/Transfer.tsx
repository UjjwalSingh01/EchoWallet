import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Add } from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import { IconButton, Avatar, Divider } from '@mui/material';
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
  const [clickedIcons, setClickedIcons] = useState<{ [key: string]: boolean }>({}); // Track clicked icons
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/user/decode/users', {
          params: { searchTerm }
        });

        setUsers(response.data.user);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handleAddClick = (id: string) => {
    setClickedIcons(prevState => ({
      ...prevState,
      [id]: true, // Mark this user as clicked
    }));
  };

  const displayedUsers = Array.isArray(users)
    ? users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage)
    : [];

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
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: 2
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
                  {user.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {user.name}
                </Typography>
                <Box sx={{justifyContent:'center', alignItems:'center'}}>
                  {!clickedIcons[user.id] && ( // Check if the icon has been clicked
                    <IconButton color="primary" onClick={() => handleAddClick(user.id)} sx={{ marginRight: {md:'none', lg:1} }}>
                      <Add />
                    </IconButton>
                  )}
                  <IconButton color="secondary">
                    <SendMoneyModal id={user.id} />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
          <Divider sx={{ marginY: 4 }} />
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(users.length / usersPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            className="flex justify-center mt-4"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
