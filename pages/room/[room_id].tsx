import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Room Page
 */
export const Room = () => {
  const router = useRouter();
  const { room_id } = router.query;

  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const socket = io();

  const sendMessage = () => {
    socket.emit("message", { room_id: room_id, username: username, content: message });
  }

  const addNewMessage = (msg: string) => {
    setMessages(messages => [...messages, msg])
  }
  const joinRoom = (assignedUsername: string) => {
    setUsername(assignedUsername)
  }

  useEffect(() => {
    if (room_id) socket.emit('join_room', { room_id });
  }, [room_id])

  socket.on("new_message", addNewMessage)
  socket.on("joined_room", joinRoom)
  
  return (
    <div>
      <div>joined room: {room_id}</div>
      <div>username: {username}</div>
      <div>
        <input onChange={e => setMessage(e.target.value)} type="text" name="message" id="message" />
        <button onClick={sendMessage}>send</button>
      </div>
      <div>
        {messages.map((m, i) => <div key={`message-${i}`}>{m}</div>)}
      </div>
    </div>
  );
};

export default Room;
