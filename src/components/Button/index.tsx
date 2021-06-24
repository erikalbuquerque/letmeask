import { ButtonHTMLAttributes } from "react"

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
}

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  const outlined = isOutlined ? 'outlined' : ''

  return (
    <button
      className={`button ${outlined}`}
      {...props}
    />
  )
}