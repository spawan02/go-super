import type { Expense } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDownCircle, ArrowUpCircle, IndianRupee } from "lucide-react"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const income = Array.isArray(expenses)
  ? expenses
      .filter((exp) => exp.category === "Income")
      .reduce((sum, exp) => sum + exp.amount, 0)
  : 0

const expense = Array.isArray(expenses)
  ? expenses
      .filter((exp) => exp.category === "Expense")
      .reduce((sum, exp) => sum + exp.amount, 0)
  : 0

  const balance = income - expense

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${income.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">${expense.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <IndianRupee  className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
