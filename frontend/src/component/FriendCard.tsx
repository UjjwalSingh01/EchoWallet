import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import SendMoneyModal from './SendModal';
import image from '../assets/profile.jpg'

interface Friend {
  id: string,
  firstname: string,
  lastname?: string
}

export default function FriendCard({ data }: { data: Friend }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{height:160}}
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
