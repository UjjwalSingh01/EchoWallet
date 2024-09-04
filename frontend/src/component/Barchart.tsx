import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, useTheme } from '@mui/material';
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
        backgroundColor: '#fff',
        padding: 2,
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: 'bold',
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
    </Box>
  );
};

export default StyledBarChart;
