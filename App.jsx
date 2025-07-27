import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
   
    setTimeout(() => {
      addBotMessage('Welcome to PingMe! How can I assist you today?');
    }, 1000);
  }, []);

  const addBotMessage = (text) => {
    setIsTyping(true);
    const chars = text.split('');
    let currentText = '';
    let index = 0;

    const typeMessage = () => {
      if (index < chars.length) {
        currentText += chars[index];
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isTyping),
          { text: currentText, sender: 'bot', isTyping: true },
        ]);
        index++;
        setTimeout(typeMessage, 50); 
      } else {
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.isTyping),
          { text: currentText, sender: 'bot', isTyping: false },
        ]);
        setIsTyping(false);
      }
    };

    gsap.to('.typing', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: typeMessage,
    });
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setTimeout(() => {
        addBotMessage('This is a simulated response from PingMe!');
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="text-2xl font-bold">PingMe</h1>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender} ${message.isTyping ? 'typing' : ''}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;