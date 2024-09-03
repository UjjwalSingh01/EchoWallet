import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';

type Dataset = { 
  name: string; 
  value: number 
}[]

const StyledBarChart = ({ dataset }: { dataset: Dataset }) => {
  const theme = useTheme();

  const data = dataset;

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        padding: { xs: 2, sm: 0 }, // Adjust padding for different screen sizes
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: { xs: 320, sm: 500, md: 600 }, // Adjust width for different screen sizes
        margin: 'auto',
        marginBottom: { xs: 3, sm: 4 }, // Adjust bottom margin for different screen sizes
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: { xs: 1, sm: 2 },
          fontWeight: 'bold',
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }, // Adjust font size for different screen sizes
        }}
      >
        Monthly Expenditure Data
      </Typography>
      <BarChart
        width={window.innerWidth < 600 ? 320 : window.innerWidth < 960 ? 500 : 600}  // Adjust width dynamically
        height={window.innerWidth < 600 ? 200 : window.innerWidth < 960 ? 250 : 300} // Adjust height dynamically
        data={data}
        barGap={8}
        barCategoryGap="20%"
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="value" 
          fill={theme.palette.primary.main} 
          barSize={window.innerWidth < 600 ? 20 : 30} // Adjust bar size dynamically
        />
      </BarChart>
    </Box>
  );
};

export default StyledBarChart;
