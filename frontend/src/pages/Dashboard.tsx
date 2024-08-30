import { useEffect, useState } from "react"
import AmountCard from "../component/AmountCard"
import Barchart from "../component/Barchart"
import BasicPie from "../component/Piechart"
import axios from "axios"

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
}

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
          setBarData(response.data.barData)
          setPieData(response.data.pieData)

        } catch (error) {
          console.error("Error in Fetching Notification: ", error);
        }
      };
  
      fetchDetails();
  }, [])

  return (
    <>
      <div className="flex-col w-full">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm: grid-cols-1  justify-around gap-16 h-auto my-16 mx-16">
            <AmountCard heading="Wallet" amount={account.balance}/>
            <AmountCard heading="Monthly Credit" amount={account.currentMonthCredit}/>
            <AmountCard heading="Monthly Debit" amount={account.currentMonthDebit}/>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1">
          <div className="grid justify-around items-center my-7 gap-10 mx-20">
            <Barchart dataset={barData} />
          </div>
          <div>
            <BasicPie dataset={pieData} />
          </div>
        </div>
      </div>
    </>
  )
}
