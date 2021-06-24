import { useEffect, useState } from "react"

import { database } from '../services/firebase'
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighlighted: boolean
  isAnswered: boolean
  likeCount: number
  likeId: string | undefined
}

type LikesType = Record<string, {
  authorId: string
}>
type FirebaseQuestions = Record<string, {
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighlighted: boolean
  isAnswered: boolean
  likes: LikesType
}>


export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  function countLikes(likes: LikesType) {
    const totalLikes = Object.values(likes ?? {}).length
    return totalLikes
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function returnLikeId(likes: LikesType) {
    const likeId = Object.entries(likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
    return likeId
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: countLikes(value.likes),
          likeId: returnLikeId(value.likes)
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

      return () => {
        roomRef.off('value')
      }
    })
  }, [returnLikeId, roomId, user?.id])

  return { questions, title }
}