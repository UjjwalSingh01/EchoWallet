export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      weekday: "short", // abbreviated weekday name (e.g., 'Mon')
      month: "short", // abbreviated month name (e.g., 'Oct')
      day: "numeric", // numeric day of the month (e.g., '25')
      hour: "numeric", // numeric hour (e.g., '8')
      minute: "numeric", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
  
    const dateDayOptions: Intl.DateTimeFormatOptions = {
      weekday: "short", // abbreviated weekday name (e.g., 'Mon')
      year: "numeric", // numeric year (e.g., '2023')
      month: "2-digit", // abbreviated month name (e.g., 'Oct')
      day: "2-digit", // numeric day of the month (e.g., '25')
    };
  
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short", // abbreviated month name (e.g., 'Oct')
      year: "numeric", // numeric year (e.g., '2023')
      day: "numeric", // numeric day of the month (e.g., '25')
    };
  
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric", // numeric hour (e.g., '8')
      minute: "numeric", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
  
    const formattedDateTime: string = new Date(dateString).toLocaleString(
      "en-US",
      dateTimeOptions
    );
  
    const formattedDateDay: string = new Date(dateString).toLocaleString(
      "en-US",
      dateDayOptions
    );
  
    const formattedDate: string = new Date(dateString).toLocaleString(
      "en-US",
      dateOptions
    );
  
    const formattedTime: string = new Date(dateString).toLocaleString(
      "en-US",
      timeOptions
    );
  
    return {
      dateTime: formattedDateTime,
      dateDay: formattedDateDay,
      dateOnly: formattedDate,
      timeOnly: formattedTime,
    };
  };

//   {
//     "dateTime": "Wed, Oct 25, 8:30 AM",
//     "dateDay": "Wed, 2023-10-25",
//     "dateOnly": "Oct 25, 2023",
//     "timeOnly": "8:30 AM"
//   }
  
  

  export const removeSpecialCharacters = (value: string) => {
    return value.replace(/[^\w\s]/gi, "");
  };

  export function formatAmount(amount: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  
    return formatter.format(amount);
  }
  



  export const transactionCategoryStyles = {
    "Food and Drink": {
      borderColor: "border-pink-600",
      backgroundColor: "bg-pink-500",
      textColor: "text-pink-700",
      chipBackgroundColor: "bg-inherit",
    },
    Payment: {
      borderColor: "border-success-600",
      backgroundColor: "bg-green-600",
      textColor: "text-success-700",
      chipBackgroundColor: "bg-inherit",
    },
    "Bank Fees": {
      borderColor: "border-success-600",
      backgroundColor: "bg-green-600",
      textColor: "text-success-700",
      chipBackgroundColor: "bg-inherit",
    },
    Transfer: {
      borderColor: "border-red-700",
      backgroundColor: "bg-red-700",
      textColor: "text-red-700",
      chipBackgroundColor: "bg-inherit",
    },
    Processing: {
      borderColor: "border-[#F2F4F7]",
      backgroundColor: "bg-gray-500",
      textColor: "text-[#344054]",
      chipBackgroundColor: "bg-[#F2F4F7]",
    },
    Success: {
      borderColor: "border-[#12B76A]",
      backgroundColor: "bg-[#12B76A]",
      textColor: "text-[#027A48]",
      chipBackgroundColor: "bg-[#ECFDF3]",
    },
    Travel: {
      borderColor: "border-[#0047AB]",
      backgroundColor: "bg-blue-500",
      textColor: "text-blue-700",
      chipBackgroundColor: "bg-[#ECFDF3]",
    },
    default: {
      borderColor: "",
      backgroundColor: "bg-blue-500",
      textColor: "text-blue-700",
      chipBackgroundColor: "bg-inherit",
    },
  };