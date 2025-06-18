export interface AdminUser {
  email: string
  password: string
  name: string
}

// Add or remove admin users here
export const adminUsers: AdminUser[] = [
  {
    email: "rahat@bfc.com",
    password: "rahat05",
    name: "Rahat Nadeem"
  },
  {
    email: "suhail@bfc.com",
    password: "suhail07",
    name: "Suhail Vaid"
  },
  {
    email: "arham@bfc.com",
    password: "arham29",
    name: "Arham Vaid"
  }
]

// Helper function to get authorized emails
export const getAuthorizedEmails = () => adminUsers.map(user => user.email)

// Helper function to find admin by email
export function findAdminByEmail(email: string): AdminUser | undefined {
  return adminUsers.find(admin => admin.email === email)
} 