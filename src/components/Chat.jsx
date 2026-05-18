import { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import "../styles/Chat.css";
const API_URL = import.meta.env.VITE_API_URL;

function Chat() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [receiverId, setReceiverId] = useState(null);

  const messagesBoxRef = useRef(null);
  const shouldScrollRef = useRef(true);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/${id}/${currentUser.id}`);
      
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/product/${id}`);
      const data = await res.json();

      if (res.ok) {
        setProductName(data.name || `Product ${id}`);
        setReceiverId(Number(data.user_id));
      } else {
        setProductName(`Product ${id}`);
      }
    } catch (error) {
      console.error("Error fetching product info:", error);
      setProductName(`Product ${id}`);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    fetchMessages();
    fetchProductInfo();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [id, currentUser]);

  useEffect(() => {
    if (shouldScrollRef.current && messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
      shouldScrollRef.current = false;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: Number(id),
          sender_id: currentUser.id,
          sender_name: `${currentUser.first_name} ${currentUser.last_name}`,
          receiver_id: receiverId,
          message: newMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send message");
        return;
      }

      setNewMessage("");
      shouldScrollRef.current = true;
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">
          <div>
            <p className="chat-subtitle">Conversation</p>
            <h1>Chat: {productName}</h1>
          </div>
        </div>

        <div className="chat-messages-box" ref={messagesBoxRef}>
          {loading ? (
            <p className="chat-empty">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="chat-empty">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  Number(msg.sender_id) === Number(currentUser.id)
                    ? "my-message"
                    : "other-message"
                }`}
              >
                <div className="chat-meta">
                  <span className="chat-sender">
                    {Number(msg.sender_id) === Number(currentUser.id)
                      ? "You"
                      : msg.sender_name}
                  </span>
                  <span className="chat-time">{formatTime(msg.created_at)}</span>
                </div>

                <p className="chat-text">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chat-input"
          />

          <button onClick={handleSend} className="chat-send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
