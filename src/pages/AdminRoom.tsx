import { useParams } from 'react-router-dom'

import { database } from '../services/firebase'

//import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  //const { user } = useAuth()

  const { id } = useParams<RoomParams>()
  const roomId = id

  const { questions, title } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string) {
    const confirm = window.confirm('Tem certeza que você deseja excluir esta pergunta?')

    if (confirm)
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}