import React, { FC } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';
import { transactionCategoryStyles, formatAmount, formatDateTime, removeSpecialCharacters } from "../lib/utils";

interface Transaction {
  name: string;
  amount: number;
  date: string;
  type: 'DEBIT' | 'CREDIT';
  category: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: FC<CategoryBadgeProps> = ({ category }) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

  return (
    <Chip
      label={category}
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        padding: '0 4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    />
  );
};

const TransactionsTable: FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: '#f9fafb' }}>
          <TableRow>
            <TableCell style={{ padding: '8px' }}><Typography variant="subtitle2">Transaction</Typography></TableCell>
            <TableCell style={{ padding: '8px' }}><Typography variant="subtitle2">Amount</Typography></TableCell>
            <TableCell style={{ padding: '8px' }}><Typography variant="subtitle2">Date</Typography></TableCell>
            <TableCell style={{ padding: '8px' }}><Typography variant="subtitle2">Category</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t, index) => {
            const amount = formatAmount(t.amount);
            const isDebit = t.type === 'DEBIT';
            const isCredit = t.type === 'CREDIT';

            return (
              <TableRow
                key={index}
                style={{
                  backgroundColor: isDebit || amount[0] === '-' ? '#FFFBFA' : '#F6FEF9',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <TableCell style={{ padding: '8px', maxWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Typography variant="body2" style={{ fontSize: '14px', fontWeight: 600, color: '#344054' }}>
                      {removeSpecialCharacters(t.name)}
                    </Typography>
                  </div>
                </TableCell>

                <TableCell
                  style={{
                    padding: '8px',
                    fontWeight: 600,
                    color: isDebit || amount[0] === '-' ? '#f04438' : '#039855',
                  }}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>

                <TableCell style={{ padding: '8px', minWidth: '32px' }}>
                  <Typography variant="body2">{formatDateTime(new Date(t.date)).dateTime}</Typography>
                </TableCell>

                <TableCell style={{ padding: '8px' }}>
                  <CategoryBadge category={t.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
