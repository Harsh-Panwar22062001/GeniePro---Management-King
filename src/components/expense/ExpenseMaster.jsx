import React, { useState } from 'react';
import { useExpenses } from '../../components/statemanagement/ExpenseContext';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import EditExpense from './EditExpense';
import { Edit } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const AnimatedCard = motion(StyledCard);

const ExpenseMaster = () => {
  const { expenses, updateExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCloseEdit = () => {
    setEditingExpense(null);
  };

  const handleUpdateExpense = (updatedExpense) => {
    updateExpense(updatedExpense);
    setEditingExpense(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={6} align="center" fontWeight="bold" color="primary" style={{ marginTop: "30px" }}>
        Expense Master
      </Typography>
      <Grid container spacing={4}>
        {expenses.map((expense, index) => (
          <Grid item xs={12} sm={6} md={4} key={expense.id}>
            <AnimatedCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              elevation={3}
            >
              <CardHeader
                title={expense.name}
                subheader={`Amount: ₹${expense.amount}`}
                action={
                  <Chip
                  label={dayjs(expense.selectedDate).format("DD/MM/YYYY")}
                  color="primary"
                  variant="outlined"
                />
                }
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>To:</strong> {expense.toSchool}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>From:</strong> {expense.fromSchool}
                </Typography>
                <Typography variant="body2" color="text.secondary">
  <strong>Time:</strong> {dayjs(expense.time, 'HH:mm').format('HH:mm')}
</Typography>
              </CardContent>
              <IconButton
                aria-label="edit"
                color="primary"
                size="small"
                onClick={() => handleEditExpense(expense)}
              >
                <Edit fontSize="inherit" />
              </IconButton>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>
      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateExpense}
        />
      )}
    </Box>
  );
};

export default ExpenseMaster;