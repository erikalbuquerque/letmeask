import { FormEvent, ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'

import '../styles/newRoom.scss'

type RoomType = {
  title: string
  authorId: string | undefined
}

export function NewRoom() {
  const { user } = useAuth()
  const [newRoom, setNewRoom] = useState('')

  function handleSetNewRoom(event: ChangeEvent<HTMLInputElement>) {
    setNewRoom(event.target.value)
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() === '') return

    const room: RoomType = {
      title: newRoom,
      authorId: user?.id
    }

    const roomRef = database.ref('rooms')

    await roomRef.push(room)

  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>
          Tire as dúvidas da sua audiência em tempo-real
        </p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={handleSetNewRoom}
              value={newRoom}
            />
            <Button type="submit">
              Criar na sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}