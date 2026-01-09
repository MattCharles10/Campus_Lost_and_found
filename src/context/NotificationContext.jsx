import React, { createContext, useState, useContext } from 'react'
import { Alert, Snackbar } from '@mui/material'

const NotificationContext = createContext({})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const showSuccess = (message) => showNotification(message, 'success')
  const showError = (message) => showNotification(message, 'error')
  const showWarning = (message) => showNotification(message, 'warning')
  const showInfo = (message) => showNotification(message, 'info')

  const handleClose = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}