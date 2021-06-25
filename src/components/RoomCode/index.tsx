import copyImg from '../../assets/images/copy.svg'
import { useToast } from '../../hooks/useToast'

import './styles.scss'

type RoomCodeProps = {
  code: string
}

export function RoomCode({ code }: RoomCodeProps) {
  const { handleToastSuccess } = useToast()

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code)
    handleToastSuccess('Copy to clipboard!')
  }

  return (
    <button
      className="room-code"
      onClick={copyRoomCodeToClipboard}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>

      <span>Sala #{code}</span>
    </button>
  )
}