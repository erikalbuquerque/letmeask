/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

import { useToast } from './hooks/useToast'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'
import { AdminRoom } from './pages/AdminRoom'

function App() {
  const { Toaster } = useToast()
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />
            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
          <Toaster containerStyle={{ top: 22 }} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
