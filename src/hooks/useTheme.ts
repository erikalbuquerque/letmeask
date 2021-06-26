/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}
