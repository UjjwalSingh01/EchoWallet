import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

interface FeaturedPostProps {
  post: {
    date: string;
    description: string;
    image: string;
    imageLabel: string;
    title: string;
  };
}

export default function TripCard() {

  return (
      <Card sx={{ display: 'flex', width: '70%', margin:5 }}>
        <CardMedia
          component="img"
          sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
          // image={post.image}
          // alt={post.imageLabel}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            title
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            date
          </Typography>
          <Typography variant="subtitle1" paragraph>
            description
          </Typography>
          <Typography variant="subtitle1" color="primary">
            Learn More
          </Typography>
        </CardContent>
      </Card>
  );
}