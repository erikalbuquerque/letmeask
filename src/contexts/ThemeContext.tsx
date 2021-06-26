/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { ReactNode, useEffect, useState, createContext } from 'react'

interface ThemeContextProps {
  isDark: boolean
  handleSetTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeContext = createContext({} as ThemeContextProps)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(true)

  function handleSetTheme() {
    setIsDark(!isDark)
  }

  useEffect(() => {
    if (isDark) {
      document.body.style.background = 'var(--black-100)'
    } else {
      document.body.style.background = 'var(--white-100)'
    }
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
