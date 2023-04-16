import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';

const Welcome = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const { socket, setRoom, setUsername } = useContext(Context);

  const handleSubmit = values => {
    const room = values.newRoom ? values.newRoom : values.room;

    if (room && values.username) {
      setRoom(room);
      setUsername(values.username);
      navigate(`/chat/${values.username}/${room}`);
    }
  };

  useEffect(() => {
    socket.emit('getRooms');

    socket.on('rooms:list', rooms => {
      setRooms(() => rooms);
    });
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Chat App
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Joining to room
            </h1>
            <Formik
              initialValues={{
                username: '',
                room: '',
                newRoom: ''
              }}
              onSubmit={handleSubmit}
            >
              {({ handleChange, values }) => (
                <Form className="space-y-4 md:space-y-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your username
                    <input
                      name="username"
                      autoComplete="off"
                      value={values.username}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
                      placeholder="nickname"
                    />
                  </label>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select a room or create new one
                    <select
                      value={values.room}
                      onChange={handleChange}
                      name="room"
                      className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
                    >
                      <option>Choose your room</option>
                      <option value="new_room">Create new room</option>
                      {rooms.map(room => (
                        <option key={room} value={room}>
                          Room: {room}
                        </option>
                      ))}
                    </select>
                  </label>
                  {values.room === 'new_room' && (
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Room name
                      <input
                        name="newRoom"
                        autoComplete="off"
                        value={values.newRoom}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
                        placeholder="Enter room name"
                      />
                    </label>
                  )}
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Join (or create) chat group
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
