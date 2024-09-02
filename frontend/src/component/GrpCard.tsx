import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const card = (
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Balance
      </Typography>
      <Typography variant="h5" component="div">
        $1000
      </Typography>
    </CardContent>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ width:'80%', margin:3, }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}