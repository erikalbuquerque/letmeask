/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import cx from 'classnames'

import { useToast } from '../../hooks/useToast'
import { useTheme } from '../../hooks/useTheme'

import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
  code: string
}

export function RoomCode({ code }: RoomCodeProps) {
  const { isDark } = useTheme()
  const { handleToastSuccess } = useToast()

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
    handleToastSuccess('Copy to clipboard!')
  }

  return (
    <button
      className={cx('room-code', { dark: isDark })}
      onClick={copyRoomCodeToClipboard}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>

      <span>Sala #{code}</span>
    </button>
  )
}
