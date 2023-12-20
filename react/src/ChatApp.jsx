import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    // Fetch messages from the server on component mount
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/messages');
      const data = await response.json();
      data[0].messages.map(data => {
        setMessages((prevMessages) => [...prevMessages, data.you]);
        setMessages((prevMessages) => [...prevMessages, data.bot]);  
      })
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      // Display user's message
      const userMessage = { text: `You: ${input}`, id: Date.now(), sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {


        // Make a GET request to the specified endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const randomPost = data[Math.floor(Math.random() * data.length)];

        // Display the bot's reply
        const botMessage = { text: `Bot: ${randomPost.title}`, id: Date.now() + 1, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);


        // Save user's message to the server
        await saveMessage({ you: userMessage, bot: botMessage });
        setInput('');
      } catch (error) {
        console.error('Error sending or receiving messages:', error);
      }
    }
  };

  const saveMessage = async (message) => {
    try {
      console.log(message)
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-app">
      <div className="chat-messages" ref={messagesRef}>
        {loading && <div className="loading">Loading...</div>}
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
