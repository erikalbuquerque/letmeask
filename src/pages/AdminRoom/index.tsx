/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import cx from 'classnames'
import { database } from '../../services/firebase'

import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { useTheme } from '../../hooks/useTheme'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'
import Switch from '@material-ui/core/Switch'
import Modal from 'react-modal'

import logoImg from '../../assets/images/logo.svg'
import logoLightImg from '../../assets/images/logo-light.svg'

import './styles.scss'
import '../../styles/modal.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const { signOut } = useAuth()
  const { isDark, handleSetTheme } = useTheme()

  const { id } = useParams<RoomParams>()
  const roomId = id

  const { questions, title } = useRoom(roomId)

  const [questionIdModalOpen, setQuestionModalOpen] = useState<
    string | undefined
  >()
  const [closeRoomModalOpen, setCloseRoomModalOpen] = useState(false)
  const [closeLogoutModalOpen, setCloseLogoutModalOpen] = useState(false)

  async function handleEndRoom() {
    const currentDate = { endedAt: new Date() }

    await database.ref(`rooms/${roomId}`).update(currentDate)

    history.push('/')
  }

  function handleCloseRoomModal() {
    setCloseRoomModalOpen(!closeRoomModalOpen)
  }

  function handleCloseQuestionModal() {
    setQuestionModalOpen(undefined)
  }

  function handleCloseLogoutModal() {
    setCloseLogoutModalOpen(!closeLogoutModalOpen)
  }

  function handleLogout() {
    signOut()
    history.push('/')
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
      <Switch
        className="switch"
        defaultChecked
        color="default"
        onClick={handleSetTheme}
      />
      <header className={cx({ dark: isDark })}>
        <div className="content">
          {isDark ? (
            <img src={logoLightImg} alt="Letmeask" />
          ) : (
            <img src={logoImg} alt="Letmeask" />
          )}
          <div>
            <RoomCode code={roomId} />
            <Button
              id="closeRoom-button"
              isOutlined
              onClick={handleCloseRoomModal}
            >
              Encerrar sala
            </Button>
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
        <div className={cx('room-title', { dark: isDark })}>
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12.0003"
                        cy="11.9998"
                        r="9.00375"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighLightQuestion(question.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setQuestionModalOpen(question.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5.99988H5H21"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Question>
          ))}
        </div>
      </main>
      <Modal
        isOpen={questionIdModalOpen !== undefined}
        onRequestClose={handleCloseQuestionModal}
        ariaHideApp={false}
        className={cx('modal', { dark: isDark })}
        overlayClassName={cx('overlay', { dark: isDark })}
      >
        <div className="content">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5.99988H5H21"
              stroke="#737380"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
              stroke="#737380"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1>Excluir pergunta</h1>
          <span>Tem certeza que você deseja excluir esta pergunta?</span>
          <div>
            <Button type="button" onClick={handleCloseQuestionModal}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteQuestion(questionIdModalOpen)}
            >
              Sim, excluir
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!closeRoomModalOpen}
        onRequestClose={handleCloseRoomModal}
        ariaHideApp={false}
        className={cx('modal', { dark: isDark })}
        overlayClassName={cx('overlay', { dark: isDark })}
      >
        <div className="content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.66 18.3398L18.34 29.6598"
              stroke="#E73F5D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.66 29.6598L18.34 18.3398"
              stroke="#E73F5D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z"
              stroke="#E73F5D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h1>Encerrar sala</h1>
          <span>Tem certeza que você deseja encerrar esta sala?</span>
          <div>
            <Button type="button" onClick={handleCloseRoomModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => handleEndRoom()}>
              Sim, encerar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!closeLogoutModalOpen}
        onRequestClose={handleCloseLogoutModal}
        ariaHideApp={false}
        className={cx('modal', { dark: isDark })}
        overlayClassName={cx('overlay', { dark: isDark })}
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
