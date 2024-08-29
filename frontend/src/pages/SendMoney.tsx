import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface toDetails {
    to_id: string,
    to_fname: string,
    to_lname: string,
    from_name: string
}

export function SendMoney(){
    
    const [amount,setAmount] = useState(0);
    const navigate = useNavigate();

    async function handleSend() {
        try {
            if(amount <= 0){
                console.error("Invalid Amount")
            }

            const data: any = localStorage.getItem('to')
            const to: toDetails = JSON.parse(data);

            console.log(to)
            
            const response = axios.post('http://localhost:8787/api/v1/transaction/decode/transfer', 
                {
                    amount: amount,
                    to_id: to.to_id,
                    to_name: to.to_fname,
                    from_name: to.from_name
                } , {
                    headers: { "Authorization": localStorage.getItem('token') }
                }
            )

            localStorage.removeItem("to");

            setTimeout(() => {
                navigate('/transfer');
            }, 2000); // 1000 milliseconds = 1 second

        } catch (error) {
            console.error("Error in Sending Money: ", error)
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <h1 className="mb-2 text-xl ">Exchange</h1>
            <input onChange={(e)=>{
                setAmount(parseInt(e.target.value));
            }} className="pl-2 mb-2 w-[30%] h-[40px] border-solid border-2 border-black" type="number" placeholder="Enter Amount"></input>
            
            <button onClick={() => {handleSend()}} className="bg-sky-500 rounded-md w-20 h-10" >Send</button>
        </div>
    )
} 