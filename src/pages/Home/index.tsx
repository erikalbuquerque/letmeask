/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-use-before-define */
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'

import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'

import { useToast } from '../../hooks/useToast'
import { useTheme } from '../../hooks/useTheme'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoLightImg from '../../assets/images/logo-light.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import Switch from '@material-ui/core/Switch'
import { Button } from '../../components/Button'

import './styles.scss'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const { handleToastError, handleToastPromise } = useToast()

  const { isDark, handleSetTheme } = useTheme()

  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (user) {
      history.push('/rooms/new')
    }
    if (!user)
      handleToastPromise(
        signInWithGoogle().then(() => {
          history.push('/rooms/new')
        })
      )
  }

  function handleSetRoomCode(event: ChangeEvent<HTMLInputElement>) {
    setRoomCode(event.target.value)
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '')
      return handleToastError('Empty room code, please fill in.')

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) return handleToastError('Room does not exists.')

    if (roomRef.val().endedAt) return handleToastError('Room already closed.')

    history.push(`rooms/${roomCode}`)
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
        <div className="main-content">
          {isDark ? (
            <img src={logoLightImg} alt="Letmeask" />
          ) : (
            <img src={logoImg} alt="Letmeask" />
          )}
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              className={cx({ dark: isDark })}
              type="text"
              placeholder="Digite o código da sala"
              onChange={handleSetRoomCode}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
