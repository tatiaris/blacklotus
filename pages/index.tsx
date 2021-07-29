import { useState } from "react"

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const goToRoom = () => {
    location.href = `/room/${roomId}`;
  }

  return (
    <div>
      <input onChange={e => setRoomId(e.target.value)} type="text" placeholder="room id" />
      <button onClick={goToRoom}>submit</button>
    </div>
  )
}
