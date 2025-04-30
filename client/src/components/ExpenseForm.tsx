"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"
import type { Expense } from "../types"

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id" | "date">) => void
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<"Income" | "Expense" | "">("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category) return

    setLoading(true)

    const newExpense: Omit<Expense, "id"| "date"> = {
      amount: parseFloat(amount),
      category,
      description,
    }

    onAddExpense(newExpense)

    setAmount("")
    setCategory("")
    setDescription("")
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount*</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category*</Label>
        <Select value={category} onValueChange={(val) => setCategory(val as "Income" | "Expense")}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !amount || !category}>
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  )
}

export default ExpenseForm
