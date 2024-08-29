// StyledBarChart.js
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';

type Dataset = Array<{ name: string; value: number }>;

const StyledBarChart = ({ dataset }: { dataset: Dataset }) => {
  const theme = useTheme();

  const data = dataset

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: 600,
        margin: '24px auto',
      }}
    >
   
        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            Monthly Expenditure Data
        </Typography>
        <BarChart 
          width={500} 
          height={300} 
          data={data} 
          barGap={8}            // Gap between bars within the same category
          barCategoryGap="20%"  // Gap between different categories
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="value" 
            fill={theme.palette.primary.main} 
            barSize={30} 
          />
        </BarChart>
   
    </Box>
  );
};

export default StyledBarChart;
