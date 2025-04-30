'use client'

import type { Expense } from '../types'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Trash2 } from 'lucide-react'

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: number) => void
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <div className="text-center py-4">No transactions found. Add your first one!</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(expenses) && expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <span
                    className={expense.category === 'Income' ? 'text-green-600' : 'text-red-600'}
                  >
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span
                    className={expense.category === 'Income' ? 'text-green-600' : 'text-red-600'}
                  >
                    ₹{expense.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    //@ts-ignore
                    onClick={() => onDeleteExpense(expense.id)}
                    aria-label="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No transactions yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
