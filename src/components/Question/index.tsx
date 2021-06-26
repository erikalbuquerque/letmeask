/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { ReactNode } from 'react'
import cx from 'classnames'

import { useTheme } from '../../hooks/useTheme'

import './styles.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighLighted?: boolean
}

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighLighted = false
}: QuestionProps) {
  const { isDark } = useTheme()
  return (
    <div
      className={cx(
        'question',
        { dark: isDark },
        { answered: isAnswered },
        { highlighted: isHighLighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  )
}
