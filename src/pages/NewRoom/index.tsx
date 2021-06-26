/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-use-before-define */
import React, { FormEvent, ChangeEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import cx from 'classnames'

import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

import { useToast } from '../../hooks/useToast'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoLightImg from '../../assets/images/logo-light.svg'

import { Button } from '../../components/Button'
import { Switch } from '@material-ui/core'

import './styles.scss'

type RoomType = {
  title: string
  authorId: string | undefined
}

export function NewRoom() {
  const history = useHistory()
  const { user } = useAuth()

  const { isDark, handleSetTheme } = useTheme()

  const { handleToastError } = useToast()

  const [newRoom, setNewRoom] = useState('')

  function handleSetNewRoom(event: ChangeEvent<HTMLInputElement>) {
    setNewRoom(event.target.value)
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() === '')
      return handleToastError('Empty room name, please fill in.')

    const room: RoomType = {
      title: newRoom,
      authorId: user?.id
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push(room)

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <Switch
        className="switch"
        defaultChecked
        color="default"
        onClick={handleSetTheme}
      />
      <aside className={cx({ dark: isDark })}>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className={cx('main-content', { dark: isDark })}>
          {isDark ? (
            <img src={logoLightImg} alt="Letmeask" />
          ) : (
            <img src={logoImg} alt="Letmeask" />
          )}
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              className={cx({ dark: isDark })}
              type="text"
              placeholder="Nome da sala"
              onChange={handleSetNewRoom}
              value={newRoom}
            />
            <Button type="submit">Criar na sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
