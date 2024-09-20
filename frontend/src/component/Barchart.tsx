import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';

type Dataset = { 
  name: string; 
  value: number 
}[]

const StyledBarChart = ({ dataset }: { dataset: Dataset }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        padding: { xs: 2, sm: 4, md: 2 },
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '95%' },
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: 6,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
          border: `2px solid ${theme.palette.background.default}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderColor: theme.palette.primary.main,
          },
          display: 'flex',
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          padding: 2,
        }}
      >
        <CardContent sx={{ width: '100%' }}>
      <Typography
        gutterBottom
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: 'bold',
          color: 'text.primary'
        }}
      >
        Monthly Expenditure Data
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataset}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="value" 
            fill={theme.palette.primary.main} 
          />
        </BarChart>
      </ResponsiveContainer>
      </CardContent>
     </Card>   
    </Box>
  );
};

export default StyledBarChart;
