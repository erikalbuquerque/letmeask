/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-use-before-define */
import React, { ChangeEvent, FormEvent, useState } from 'react'
import cx from 'classnames'
import { useHistory, useParams } from 'react-router-dom'

import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { useToast } from '../../hooks/useToast'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'
import Modal from 'react-modal'

import logoImg from '../../assets/images/logo.svg'

import './styles.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const history = useHistory()

  const { user, signInWithGoogle, signOut } = useAuth()

  const { handleToastError, handleToastPromise } = useToast()

  const [closeLogoutModalOpen, setCloseLogoutModalOpen] = useState(false)

  const { id } = useParams<RoomParams>()
  const roomId = id

  const [newQuestion, setNewQuestion] = useState('')

  const { questions, title } = useRoom(roomId)

  function handleSetNewQuestion(event: ChangeEvent<HTMLTextAreaElement>) {
    setNewQuestion(event.target.value)
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '')
      return handleToastError('Empty question, please fill in.')

    if (!user) return handleToastError('You must be logged in.')

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (!user) return handleToastError('You must be logged in.')

    if (likeId) {
      await database
        .ref(`/rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove()
    } else {
      const dataLike = { authorId: user?.id }
      await database
        .ref(`/rooms/${roomId}/questions/${questionId}/likes`)
        .push(dataLike)
    }
  }

  function handleLogout() {
    signOut()
    history.push('/')
  }

  function handleCloseLogoutModal() {
    setCloseLogoutModalOpen(!closeLogoutModalOpen)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              id="logout-button"
              type="button"
              onClick={handleCloseLogoutModal}
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2.5H16.3333C16.7754 2.5 17.1993 2.67559 17.5118 2.98816C17.8244 3.30072 18 3.72464 18 4.16667V15.8333C18 16.2754 17.8244 16.6993 17.5118 17.0118C17.1993 17.3244 16.7754 17.5 16.3333 17.5H13"
                  stroke="#E73F5D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 5.83332L2.83333 9.99999L7 14.1667"
                  stroke="#E73F5D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 10H3"
                  stroke="#E73F5D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={handleSetNewQuestion}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar sua pergunta,{' '}
                <button
                  type="button"
                  onClick={() => handleToastPromise(signInWithGoogle())}
                >
                  faça seu login
                </button>
                .
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

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
                <button
                  className={cx('like-button', {
                    liked: question.likeId && true
                  })}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </Question>
          ))}
        </div>
      </main>
      <Modal
        isOpen={!!closeLogoutModalOpen}
        onRequestClose={handleCloseLogoutModal}
        ariaHideApp={false}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="content">
          <h1>Quer mesmo sair? :/</h1>
          <div>
            <Button type="button" onClick={handleCloseLogoutModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => handleLogout()}>
              Sim, sair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
