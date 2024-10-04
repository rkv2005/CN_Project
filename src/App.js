import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MessageSquare, Phone, Video, MoreVertical } from 'lucide-react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = new Socket('http://localhost:3001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'me',
      };
      setMessages([...messages, newMessage]);
      socket.emit('chat message', newMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-green-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">WhatsApp Clone</h1>
        <div className="flex space-x-4">
          <Video className="cursor-pointer" />
          <Phone className="cursor-pointer" />
          <MoreVertical className="cursor-pointer" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === 'me'
                ? 'bg-green-200 ml-auto'
                : 'bg-white mr-auto'
            }`}
          >
            {message.text}
          </div>
        ))}
      </main>
      <footer className="bg-white p-4">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="Type a message"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-r-lg"
          >
            <MessageSquare />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
