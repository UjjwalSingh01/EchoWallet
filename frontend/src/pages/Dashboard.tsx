import { useEffect, useState } from "react";
import AmountCard from "../component/AmountCard";
import Barchart from "../component/Barchart";
import BasicPie from "../component/Piechart";
import axios from "axios";
import { Box } from "@mui/system";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

// const BACKEND_URL = process.env.NODE_ENV === "production" ? 
//           "https://echowallet-backend.dragneeln949.workers.dev" : 
//           "http://localhost:8787/api/v1"

interface BarData { 
  name: string; 
  value: number 
};

interface PieData {
  foodExpenditure: number;
  shoppingExpenditure: number;
  travelExpenditure: number;
  otherExpenditure: number;
};

interface AccountDetails {
  balance: number,
  currentMonthCredit: number,
  currentMonthDebit: number
};

export const Dashboard = () => {
  const [account, setAccount] = useState<AccountDetails>({
    balance: 0,
    currentMonthCredit: 0,
    currentMonthDebit: 0
  });
  const [barData, setBarData] = useState<BarData[]>([]);
  const [pieData, setPieData] = useState<PieData>({
    foodExpenditure: 0,
    shoppingExpenditure: 0,
    travelExpenditure: 0,
    otherExpenditure: 0
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/detail/decode/dashboardDetails`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });

        setAccount(response.data.account); 
        setBarData(response.data.barData);
        setPieData(response.data.pieData);

      } catch (error) {
        console.error("Error in Fetching DashBoard Details: ", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',           
        justifyContent: 'center',  
        alignItems: 'center',      
        height: '100vh',           
        width: '100vw',            
        boxSizing: 'border-box',   
        padding: 2,                
      }}
    >
      <Card  sx={{ 
          width: '80%',           
          height: '80%',          
          display: 'flex',        
          flexDirection: 'column',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <CardContent>
          <div className="grid xl:grid-cols-3">
            <AmountCard heading="Wallet" amount={account.balance}/>
            <AmountCard heading="Month Credit" amount={account.currentMonthCredit}/>
            <AmountCard heading="Month Debit" amount={account.currentMonthDebit}/>
          </div>
          <div className="flex-row justify-around mt-8 lg:mt-20 xl:flex">
            <div className="flex w-full">
              <Barchart dataset={barData} />
            </div>
            <div className="flex w-full">
              <BasicPie dataset={pieData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};
