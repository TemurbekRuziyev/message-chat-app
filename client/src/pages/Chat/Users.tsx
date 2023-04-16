import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../App';

interface IUser {
  username: string;
  isOnline: boolean;
}

const Users = () => {
  const { socket } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const [typer, setTyper] = useState();

  useEffect(() => {
    socket.on('users:list', data => {
      setUsers(data);
    });

    socket.on('typing:indication', username => {
      setTyper(username);
    });
  }, []);

  return (
    <div className="basis-1/5">
      <h3 className="text-white text-xl mb-4">Users ({users.length})</h3>
      {users.map(user => (
        <div
          key={user.username}
          className="flex items-center gap-1 p-3 rounded-xl dark:bg-slate-600 text-white text-sm mb-3"
        >
          {user.username}

          {user.username === typer && (
            <div className="typing ml-2">
              <span className="circle bouncing"></span>
              <span className="circle bouncing"></span>
              <span className="circle bouncing"></span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Users;
