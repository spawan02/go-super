"use client"

import { useState, useEffect } from "react"
import type { User, Expense, NewExpense } from "../types"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { toast } from "sonner";
import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"
import ExpenseSummary from "./ExpenseSummary"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Download, LogOut } from "lucide-react"
import api from "../api/axios"

interface DashboardProps {
  user: User
  onLogout: () => void
}

interface AddExpenseResponse {
  expenses: Expense
}

interface FetchExpenseResponse {
  expenses: Expense[]
}
export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await api.get<FetchExpenseResponse>("/expenses")
      const fetched = response.data.expenses
      if (!Array.isArray(fetched)) {
        console.error("Previous expenses state is not an array:", fetched)
        setExpenses([])
      }else{
        setExpenses(fetched)
      }
  
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to load expenses",
      })
    } finally {
      setLoading(false)
    }
    }
  const handleAddExpense = async (Expense: NewExpense) => {
    try {
      const response = await api.post<AddExpenseResponse>("/expenses", Expense)
      console.log(response)

      setExpenses((prev)=> {
        if (!Array.isArray(prev)) {
          console.error("Previous expenses state is not an array:", prev)
          return [response.data.expenses] // reset safely
        }
        return [...prev, response.data.expenses]      
      })
  
      toast("Success", {
        description: "Expense added successfully",
      })
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to add expense",
      })
    }
  }
  

  const handleDeleteExpense = async (id: number) => {
    try {
      await api.delete(`/expenses/${id}`)

      setExpenses((prev) => Array.isArray(prev) ? prev.filter((expense) => expense.id !== id) : [])
  
      toast("Success", {
        description: "Expense deleted successfully",
      })
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to delete expense",
      })
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF("p", "mm", "a4")

      doc.setFontSize(18)
      doc.text("Expense Report", 14, 20)

      doc.setFontSize(12)
      doc.text(`User: ${user.email}`, 14, 30)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36)

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
      doc.text(`Total Income: ₹${income.toFixed(2)}`, 14, 44)
      doc.text(`Total Expenses: ₹${expense.toFixed(2)}`, 14, 50)
      doc.text(`Balance: ₹${(income - expense).toFixed(2)}`, 14, 56)

      const tableColumn = ["Date", "Category", "Amount", "Description"]
      const tableRows = expenses.map((expense) => [
        expense.createdAt,
        expense.category,
        `₹${expense.amount.toFixed(2)}`,
        expense.description || "",
      ])
      
      // @ts-ignore - jspdf-autotable types not recognized
      autoTable(doc,{
        head: [tableColumn],
        //@ts-ignore
        body: tableRows,
        startY: 40,
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 186] },
        pageBreak: "auto"
      })
      doc.save("expense-report.pdf")

      toast("Success",{
        description: "PDF exported successfully",
      })
    } catch (error) {
      console.log(error)
      toast("Error",{
        description: "Failed to export PDF",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expense Manager</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Record a new transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onAddExpense={handleAddExpense} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-5">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <ExpenseSummary expenses={expenses} />
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>Manage your transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">Loading expenses...</div>
                    ) : (
                      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
