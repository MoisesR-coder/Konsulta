import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      // Verificar si el token es válido
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        
        if (payload.exp < currentTime) {
          // Token expirado
          logout()
        } else {
          setUser({ username: payload.sub })
        }
      } catch (error) {
        console.error('Token inválido:', error)
        logout()
      }
    }
  }, [token])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const response = await authService.login(username, password)
      const { access_token } = response.data
      
      setToken(access_token)
      localStorage.setItem('token', access_token)
      
      // Decodificar token para obtener información del usuario
      const payload = JSON.parse(atob(access_token.split('.')[1]))
      setUser({ username: payload.sub })
      
      return { success: true }
    } catch (error) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de autenticación' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  const value = {
    token,
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}