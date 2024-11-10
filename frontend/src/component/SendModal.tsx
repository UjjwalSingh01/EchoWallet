import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Divider, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const BACKEND_URL = "https://echowallet-backend.dragneeln949.workers.dev/api/v1"

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const schema = z.object({
  amount: z.string().regex(/^\d+$/, 'Amount must only contain digits'),
  // amount: z.number().positive().int().min(1, 'Amount must be a positive number'),
  pin: z.string().length(6, 'Pin must be exactly 6 digits').regex(/^\d{6}$/, 'Pin must only contain digits'),
  category: z.string().nonempty('Category is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SendMoneyModal({id}:{id: string}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("OTHER");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const { register, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    // defaultValues: {
    //   amount: '',
    //   pin: '',
    //   category: 'OTHER',
    //   description: ''
    // }
  });

  const amount = watch('amount');
  const pin = watch('pin');
  const description = watch('description');

  const handleOpen = () => {
    setOpen(true);
    reset();
    setCategory("OTHER");
  };

  async function handleClose() {
    try {
      const result = schema.safeParse({
        amount: amount,
        pin: pin,
        category: category,
        description: description,
      });

      if(!result.success){
        result.error.errors.forEach((error) => {
          console.log(error.message)
          showSnackbar(`${error.message}`, "error");
        });
        return;
      }

      const response = await axios.post(`${BACKEND_URL}/transaction/decode/transaction`,
        {
          to: id,
          amount: parseInt(amount),
          // amount,
          pin,
          category,
          description
        }, {
          headers: { "Authorization": localStorage.getItem("token") },
        }
      );

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, 'success');
      }
      else {
        showSnackbar(`${response.data.error}`, 'error');
      }

      setOpen(false);
      
    } catch (error) {
      showSnackbar('Error in Making Transaction', 'error');
      console.error("Error in Making Transaction: ", error);
    }

  }

  return (
    <div>
      <Button onClick={handleOpen}>Send Money</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ marginBottom: 2, marginTop: 2 }} variant="h6" id="parent-modal-title">Send Money</Typography>

          <TextField
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            id="outlined-basic"
            label="Amount"
            variant="outlined"
            sx={{ marginBottom: 3, width: '100%' }}
          />

          <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
            <FormLabel component="legend">Category</FormLabel>
            <RadioGroup
              row
              aria-label="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <FormControlLabel value="FOOD" control={<Radio />} label="Food" />
              <FormControlLabel value="SHOPPING" control={<Radio />} label="Shopping" />
              <FormControlLabel value="TRAVEL" control={<Radio />} label="Travel" />
            </RadioGroup>
          </FormControl>

          <TextField
            {...register('description')}
            id="outlined-basic"
            label="Description (optional)"
            variant="outlined"
            multiline
            rows={2}
            sx={{ marginBottom: 3, width: '100%' }}
          />

          <Divider />

          <Typography sx={{ marginBottom: 2, marginTop: 2 }} variant="h6">Enter Pin</Typography>
          <TextField
            {...register('pin')}
            error={!!errors.pin}
            helperText={errors.pin?.message}
            id="outlined-basic"
            label="Pin"
            variant="outlined"
            sx={{ marginBottom: 3, width: '100%' }}
          />

          <Button variant="outlined" onClick={() => (handleClose())} sx={{ width: '100%' }}>Send</Button>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          width: '400px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '0',
          '& .MuiSnackbarContent-root': {
            padding: 0,
          },
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            background: snackbarSeverity === 'success'
              ? 'linear-gradient(90deg, rgba(70,203,131,1) 0%, rgba(129,212,250,1) 100%)'
              : 'linear-gradient(90deg, rgba(229,57,53,1) 0%, rgba(244,143,177,1) 100%)',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '28px', 
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

