export interface User {
    id: string
    email: string
  }
  
export interface Expense {
  id?: number
  amount: number
  category: "Income" | "Expense"
  description?: string
  createdAt?: string
}
  

export type NewExpense = Omit<Expense, "id" | "date">
