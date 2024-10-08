import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Dataset {
  foodExpenditure: number;
  shoppingExpenditure: number;
  travelExpenditure: number;
  otherExpenditure: number;
}

export default function InteractivePieChart({ dataset }: { dataset: Dataset }) {
  const theme = useTheme();
  
  const data = [
    { name: 'Food', value: dataset.foodExpenditure },
    { name: 'Shopping', value: dataset.shoppingExpenditure },
    { name: 'Travel', value: dataset.travelExpenditure },
    { name: 'Others', value: dataset.otherExpenditure },
  ];

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
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Expenditure Distribution
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 8,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={3}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#555' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      </CardContent>
      </Card>
    </Box>
  );
}
