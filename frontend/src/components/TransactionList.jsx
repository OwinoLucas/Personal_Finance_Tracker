import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { deleteTransaction } from '../store/slices/transactionSlice';

function TransactionList() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const [editingId, setEditingId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    // Implement edit functionality
  };

  if (loading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Typography
                  color={
                    transaction.transaction_type === 'income'
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  ${parseFloat(transaction.amount).toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={transaction.transaction_type}
                  color={
                    transaction.transaction_type === 'income'
                      ? 'success'
                      : 'error'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>{transaction.category_name}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(transaction.id)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(transaction.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionList; 