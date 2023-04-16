import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Chat from './pages/Chat';

const socket = io('http://127.0.0.1:8080/');

export const Context = React.createContext<{
  socket: Socket;
  username: string;
  setUsername: (room: string) => void;
  room: string;
  setRoom: (room: string) => void;
}>({
  socket: socket,
  room: '',
  username: '',
  setRoom: () => {},
  setUsername: () => {}
});

function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');

  return (
    <BrowserRouter>
      <Context.Provider value={{ socket: socket, room, setRoom, username, setUsername }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/chat/:username/:room" element={<Chat />} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
