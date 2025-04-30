import { toast } from 'sonner'

export const showLoginSuccess = (username: string) => {
  toast('Login Successful', {
    description: `Welcome, ${username}!`,
  })
}

export const showLogout = () => {
  toast('Logged Out', {
    description: 'You have been logged out successfully.',
  })
}
