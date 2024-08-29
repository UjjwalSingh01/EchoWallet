import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Dataset {
  foodExpenditure: number;
  shoppingExpenditure: number;
  travelExpenditure: number;
  otherExpenditure: number;
}

export default function InteractivePieChart({ dataset }: { dataset: Dataset }) {
  const initialData = [
    { name: 'Food', value: dataset.foodExpenditure },
    { name: 'Shopping', value: dataset.shoppingExpenditure },
    { name: 'Travel', value: dataset.travelExpenditure },
    { name: 'Others', value: dataset.otherExpenditure },
  ];
  
  // const [data, setData] = useState(initialData);
  const data = initialData

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: 500,
        margin: '24px auto',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Expenditure Distribution
      </Typography>

      <ResponsiveContainer height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={140}
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
            height={36}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#555' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
