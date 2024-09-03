import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


interface propsType {
  heading: string,
  amount: number
}

export default function OutlinedCard({ heading, amount }: propsType) {
  return (
    <Box sx={{ width:'80%', margin:3, }}>
      <Card variant="outlined">
        <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {heading}
        </Typography>
        <Typography variant="h5" component="div">
          ${amount}
        </Typography>
      </CardContent>
      </Card>
    </Box>
  );
}