import React, { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import moment from 'moment/moment';

interface IMessage {
  message: string;
  username: string;
  createdAt: string;
}

let timer;
const waitTime = 500;

const Messages = () => {
  const navigate = useNavigate();
  const params = useParams<{ room: string; username: string }>();
  const { room, socket, setRoom, username, setUsername } = useContext(Context);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const handleSubmit = ({ message }) => {
    socket.emit('message:send', {
      message,
      createdAt: moment().format('DD.MM.YYYY HH:mm:ss'),
      username
    });
  };

  const stopTyping = () => {
    socket.emit('typing:clear', { username, room });
  };

  // Typing indication
  const handleTyping = () => {
    socket.emit('typing', { room, username });

    clearTimeout(timer);

    timer = setTimeout(() => {
      stopTyping();
    }, waitTime);
  };

  const onLeave = room => {
    socket.emit('rooms:leave', { room, username });

    navigate('/');
  };

  // Joining the room
  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
    }

    if (params.room) {
      setRoom(params.room);
    }

    if (params.room && params.username) {
      socket.emit('rooms:join', {
        username: params.username,
        room: params.room
      });
    }
  }, []);

  // Message handlers
  useEffect(() => {
    socket.on('message:one', (message: IMessage) => {
      setMessages(prevState => [...prevState, message]);
    });

    socket.emit('messages:list', '', messages => {
      setMessages(prevState => [...prevState, ...messages]);
    });

    return () => {
      socket.off('message:one', (message: IMessage) => {
        setMessages(prevState => [...prevState, message]);
      });
    };
  }, []);

  // Scroll to the bottom
  useEffect(() => {
    const content = document.getElementById('messages')!;

    content.scrollTo({
      top: content.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <div className="min-h-full flex items-center flex-col justify-center grow">
      <div className="flex justify-between shadow w-full rounded-md  mb-4 font-bold text-gray-900 md:text-xl dark:text-white">
        Room: {room}
        <button
          type="button"
          onClick={() => onLeave(params.room)}
          className="px-3 py-2 text-xs font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-blue-800"
        >
          Leave
        </button>
      </div>

      <div
        className="grow w-full bg-gray-800 p-4 rounded-xl text-white overflow-y-auto shadow-xl shadow-inner"
        id="messages"
      >
        {messages.map(message =>
          message.username === username ? (
            <div key={message.createdAt + message.username}>
              <div className="rounded-t-xl rounded-l-3xl p-4 bg-blue-500 w-max ml-auto mt-3 max-w-[60%] break-words">
                {message.message}
              </div>
              <div className="flex gap-2 align-center ml-auto w-max mt-1">
                <span className="text-white font-semibold text-xs">You</span>
                <span className="text-gray-500 text-xs">{message.createdAt}</span>
              </div>
            </div>
          ) : (
            <div key={message.createdAt + message.username}>
              <div className="rounded-t-xl rounded-r-3xl p-4 bg-gray-700 w-max mt-3 max-w-[60%] break-words">
                {message.message}
              </div>
              <div className="flex gap-2 align-center w-max mt-1">
                <span className="text-white font-semibold text-xs">{message.username}</span>
                <span className="text-gray-500 text-xs">{message.createdAt}</span>
              </div>
            </div>
          )
        )}
      </div>
      <Formik
        initialValues={{
          message: ''
        }}
        onSubmit={(values, formikHelpers) => {
          handleSubmit(values);
          formikHelpers.resetForm();
        }}
      >
        {({ values, handleChange }) => (
          <Form className="w-full flex items-center mt-4 gap-2">
            <input
              type="text"
              name="message"
              value={values.message}
              onChange={handleChange}
              onKeyDown={handleTyping}
              autoComplete="off"
              placeholder="Type your message"
              className="grow p-2 border border-gray-300 rounded-xl focus:outline-none"
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Icon description</span>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Messages;
