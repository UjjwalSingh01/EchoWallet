import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

interface TransactionDetails {
  name: string;
  date: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '12px 20px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    padding: '10px 20px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  '& td': {
    border: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function UserTable({transactions}: {transactions: TransactionDetails[]}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <Table sx={{ minWidth: 700, borderCollapse: 'separate', borderSpacing: '0 10px' }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Transaction</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <StyledTableRow key={transaction.name}>
                <StyledTableCell  scope="row">
                  {transaction.name}
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: transaction.type === 'CREDIT' ? "green" : "red" }} align="center">
                  ₹ {transaction.amount}
                </StyledTableCell>
                <StyledTableCell align="center">{transaction.date}</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: transaction.category === 'Food' 
                          ? '#D09683' 
                          : transaction.category === 'Travel' 
                          ? '#CC313D' 
                          : 'blue',     
                    }}
                  align="center"
                  >
                  {transaction.category}
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
