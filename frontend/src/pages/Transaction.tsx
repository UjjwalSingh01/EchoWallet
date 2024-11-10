import axios from "axios";
import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserTable from "../component/TransactionTable";
import { Divider } from "@mui/material";

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

interface TransactionDetails {
  name: string;
  date: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: 'FOOD' | 'TRAVEL' | 'OTHER' | 'SHOPPING';
}

const Transaction = () => {
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/transaction/decode/gettransaction`, {
          headers: { "Authorization": localStorage.getItem("token") }
        });

        setTransactions(response.data.transactions);

      } catch (error) {
        console.error("Error in Fetching Details: ", error);
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
      <Card sx={{ 
          width: '80%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxShadow: 6, 
          borderRadius: 3,
          bgcolor: 'background.paper',
          '&:hover': {
            boxShadow: 12,
            transform: 'translateY(-5px)',
          },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        }}>
        <CardContent>
          <Typography sx={{ fontSize: 44, marginBottom: 4, marginTop: 2, marginLeft: 2 }} color="text.secondary" gutterBottom>
            Transactions
          </Typography>
          <Divider />

          <UserTable transactions={transactions} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default Transaction;
