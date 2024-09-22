import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


interface propsType {
  heading: string,
  amount: number
}

export default function GrpCard({ heading, amount }: propsType) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center vertically
        width: '100%',
        height: '100%', // Ensure the Box takes full height
        textAlign: 'center',
        padding: { xs: 2, sm: 4, md: 2 }, // Padding around the outer Box
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '80%' },
          maxWidth: 600, // Optional max width to prevent the card from getting too wide
          borderRadius: 4,
          boxShadow: 6, // Adding shadow for depth
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
          border: `2px solid ${theme.palette.background.default}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderColor: theme.palette.primary.main,
          },
          display: 'flex',
          flexDirection: 'column', // Ensure the content inside the card is vertically stacked
          justifyContent: 'center', // Center content vertically inside the card
          alignItems: 'center', // Center content horizontally inside the card
          // backgroundColor
        }}  
      >
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