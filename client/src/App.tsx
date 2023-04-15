import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

import './App.css';

const socket = io('http://127.0.0.1:8080/');

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      socket.on('welcome', message => {
        console.log(message);
      });
    });
  }, []);

  return <div className="App">Welcome to the chat app</div>;
}

export default App;
