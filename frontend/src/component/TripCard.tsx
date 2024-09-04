import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

interface GroupDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  balance: number;
}

export default function TripCard({data} : {data: GroupDetails}) {

  return (
      <Card sx={{ display: 'flex', width: 'full', marginTop:5, marginBottom:5, marginLeft:10, marginRight:10 }}>
        <CardMedia
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          // image={post.image}
          // alt={post.imageLabel}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {data.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {data.date}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {data.description}
          </Typography>
          <Typography variant="subtitle1" color= {data.balance > 0 ? "green" : "red"}>
            Balance: ₹{Math.abs(data.balance)}
          </Typography>
        </CardContent>
      </Card>
  );
}