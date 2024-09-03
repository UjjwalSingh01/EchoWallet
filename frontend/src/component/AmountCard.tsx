// import { useTheme } from '@emotion/react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface PropsType {
  heading: string;
  amount: number;
}

export default function AmountCard({ heading, amount }: PropsType) {
  // const theme = useTheme();

  return (
    <Box
      className="flex justify-center text-center w-full"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 4, md: 2 }, // Padding adjusted for different screen sizes
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'gray.200',
          borderRadius: 2,
          width: { xs: '100%', sm: '90%', md: '80%', lg: '100%' }, // Adjust width for different screen sizes
          margin: { xs: 1, md: 3 },
          height:200
        }}
      >
        <Card
          variant="outlined"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: 'none',
          }}
        >
          <CardContent>
            <Typography
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Adjust font size for different screen sizes
                textAlign: 'center',
                color: 'text.secondary',
                // fontFamily: 'sans-serif'
              }}
            >
              {heading}:
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }, // Adjust font size for different screen sizes
                marginTop: 2,
                textAlign: 'center',
              }}
            >
              ₹{amount}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
