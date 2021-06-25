import { useHistory, useParams } from 'react-router-dom'

import { database } from '../../services/firebase'

import { useRoom } from '../../hooks/useRoom'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'
import Modal from 'react-modal'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'

import './styles.scss'
import '../../styles/modal.scss'

import { useState } from 'react'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  //const { user } = useAuth()
  const history = useHistory()

  const { id } = useParams<RoomParams>()
  const roomId = id

  const { questions, title } = useRoom(roomId)

  const [questionIdModalOpen, setQuestionModalOpen] = useState<string | undefined>()
  const [closeRoomModalOpen, setCloseRoomModalOpen] = useState(false)

  async function handleEndRoom() {
    const currentDate = { endedAt: new Date() }

    await database.ref(`rooms/${roomId}`).update(currentDate)

    history.push('/')
  }

  function handleCloseRoomModal() {
    setCloseRoomModalOpen(!closeRoomModalOpen);
  }

  function handleCloseQuestionModal() {
    setQuestionModalOpen(undefined)
  }

  async function handleDeleteQuestion(questionId: string | undefined) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    handleCloseQuestionModal()
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleCloseRoomModal}
            >Encerrar sala</Button>
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
              isAnswered={question.isAnswered}
              isHighLighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighLightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setQuestionModalOpen(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
      <Modal
        isOpen={questionIdModalOpen !== undefined}
        onRequestClose={handleCloseQuestionModal}
        ariaHideApp={false}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1>Excluir pergunta</h1>
          <span>Tem certeza que você deseja excluir esta pergunta?</span>
          <div>
            <Button
              type="button"
              onClick={handleCloseQuestionModal}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteQuestion(questionIdModalOpen)}>
              Sim, excluir
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!closeRoomModalOpen}
        onRequestClose={handleCloseRoomModal}
        ariaHideApp={false}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="content">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.66 18.3398L18.34 29.6598" stroke="#E73F5D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M29.66 29.6598L18.34 18.3398" stroke="#E73F5D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd" d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z" stroke="#E73F5D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h1>Encerrar sala</h1>
          <span>Tem certeza que você deseja encerrar esta sala?</span>
          <div>
            <Button
              type="button"
              onClick={handleCloseRoomModal}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => handleEndRoom()}>
              Sim, encerar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}