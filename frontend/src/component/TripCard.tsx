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
    <Card 
      sx={{ 
        display: 'flex', 
        // width: '95%', 
        margin: 5, 
        boxShadow: 4, 
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ 
          width: 160, 
          display: { xs: 'none', sm: 'block' },
          borderRadius: '4px 0 0 4px',
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
        // image={data.image}
        // alt={data.title}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography component="h2" variant="h5" sx={{ color: 'primary.main' }}>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {data.date}
        </Typography>
        <Typography variant="subtitle1" paragraph sx={{ color: 'text.primary' }}>
          {data.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: data.balance > 0 ? 'green' : 'red' }}>
          Balance: ₹{Math.abs(data.balance)}
        </Typography>
      </CardContent>
    </Card>
  );
}
