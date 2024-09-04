import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import SendMoneyModal from './SendModal';
import image from '../assets/profile.jpg';

interface Friend {
  id: string,
  firstname: string,
  lastname?: string
}

export default function FriendCard({ data }: { data: Friend }) {
  return (
    <Card sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: 'center',
        mb: 2 
      }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: 100 }, 
            height: { xs: 100, sm: 'auto' }, 
            objectFit: 'cover' 
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
      <CardActions>
        <SendMoneyModal id={data.id} />
      </CardActions>
    </Card>
  );
}
