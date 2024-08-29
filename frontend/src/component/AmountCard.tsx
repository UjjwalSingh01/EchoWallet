
interface AmountProps {
  heading: string, 
  amount: number
}

const AmountCard = (props: AmountProps) => {
  return (
    
    <div className='flex justify-center text-center w-full' >
      <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg drop-shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h1 className=" text-4xl">{props.heading} :</h1>
        <h3 className="text-2xl mt-2">₹ {props.amount}</h3>
      </div>
    </div>
  )
}

export default AmountCard