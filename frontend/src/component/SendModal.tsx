import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Divider, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Use percentage for responsive width
  maxWidth: 600, // Set a maximum width
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
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState("OTHER");

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
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
    reset()
  };

  async function handleClose() {
    try {
      const result = await schema.safeParseAsync({
        amount: amount,
        pin: pin,
        category: category,
        description: description,
      });

      if (result.success) {
        const response = await axios.post('http://localhost:8787/api/v1/user/decode/transaction',
          {
            id,
            amount: parseInt(amount),
            // amount,
            pin,
            category,
            description
          }, {
            headers: { "Authorization": localStorage.getItem("token") },
          }
        );

        console.log(response.data);
        setOpen(false);
      } else {
        console.error(result.error);
        // Handle errors here (e.g., show a toast or alert)
      }
      
    } catch (error) {
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

          <Button variant="outlined" onClick={handleSubmit(handleClose)} sx={{ width: '100%' }}>Send</Button>
        </Box>
      </Modal>
    </div>
  );
}

