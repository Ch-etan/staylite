import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const UserContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext)

export function UserProvider({ children }) {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState(() => Number(localStorage.getItem('userId')) || 2)

  useEffect(() => {
    api.users().then(setUsers).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('userId', String(userId))
  }, [userId])

  const user = users.find((u) => u.id === userId) || null

  return (
    <UserContext.Provider value={{ users, user, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}