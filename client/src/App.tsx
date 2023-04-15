import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';

const socket = io('http://127.0.0.1:8080/');

export const Context = React.createContext<{
  socket: Socket;
}>({
  socket: socket
});

function App() {
  return (
    <BrowserRouter>
      <Context.Provider value={{ socket: socket }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
