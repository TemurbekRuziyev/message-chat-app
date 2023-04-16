import React from 'react';
import Messages from './Messages';
import Users from './Users';

const Chat = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 box-border">
      <div className="flex justify-center mx-auto h-screen w-2/3 gap-6 px-4 py-4">
        <Users />
        <Messages />
      </div>
    </section>
  );
};

export default Chat;
