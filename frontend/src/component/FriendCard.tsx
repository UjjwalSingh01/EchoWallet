import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import SendMoneyModal from './SendModal';
import image from '../assets/profile.jpg';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

interface Friend {
  id: string;
  firstname: string;
  lastname?: string;
}

export default function FriendCard({ data }: { data: Friend }) {
  const theme = useTheme();

  async function RemoveFriend() {
    try {
      await axios.post('http://localhost:8787/api/v1/detail/decode/removefriend', {
        id: data.id
      }, {
        headers: { "Authorization": localStorage.getItem("token") }
      });
    } catch (error) {
      console.error('Error in Removing Friend: ', error);
    }
  }

  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        mb: 2,
        borderRadius: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
        // border: `2px solid ${theme.palette.background.default}`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: '100%', sm: 100 },
            height: { xs: 100, sm: 'auto' },
            objectFit: 'cover',
            borderRadius: 2,
          }}
          image={image}
          alt="friend"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.firstname} {data.lastname}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: "flex", flexDirection: 'column', justifyContent: "space-between", p: 2 }}>
        <SendMoneyModal id={data.id} />
        <Button onClick={() => { RemoveFriend() }} variant="outlined" sx={{ marginTop: 2 }}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}
