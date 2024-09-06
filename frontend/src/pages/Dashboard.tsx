import { useEffect, useState } from "react";
import AmountCard from "../component/AmountCard";
import Barchart from "../component/Barchart";
import BasicPie from "../component/Piechart";
import axios from "axios";
import { Box } from "@mui/system";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

type BarData = Array<{ name: string; value: number }>;
type PieData = {
  foodExpenditure: number;
  shoppingExpenditure: number;
  travelExpenditure: number;
  otherExpenditure: number;
};
type AccountDetails = {
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
  const [barData, setBarData] = useState<BarData>([
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
  ]);
  const [pieData, setPieData] = useState<PieData>({
    foodExpenditure: 10,
    shoppingExpenditure: 20,
    travelExpenditure: 20,
    otherExpenditure: 10
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8787/api/v1/detail/decode/dashboardDetails', {
          headers: { "Authorization": localStorage.getItem("token") }
        });

        setAccount(response.data.account); 
        setBarData(response.data.barData);
        setPieData(response.data.pieData);

      } catch (error) {
        console.error("Error in Fetching Notification: ", error);
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
