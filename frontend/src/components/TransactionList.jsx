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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../store/slices/transactionSlice';

function TransactionList() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
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
              <TableCell>{transaction.category_name || 'Uncategorized'}</TableCell>
              <TableCell>
                <Chip
                  label={transaction.transaction_type}
                  color={transaction.transaction_type === 'income' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                ${parseFloat(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(transaction.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton size="small">
                  <EditIcon />
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