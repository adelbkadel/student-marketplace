import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/Conversations.css";
const API_URL = import.meta.env.VITE_API_URL;

function Conversations() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await fetch(
        `${API_URL}/conversations/${currentUser.id}`
      );
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchConversations();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="conversations-page">
      <div className="conversations-card">
        <h1>My Conversations</h1>

        {loading ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <Link
                key={conv.product_id}
                to={`/chat/${conv.product_id}`}
                className="conversation-item"
              >
                <img
                  src={
                    conv.product_image ||
                    "https://via.placeholder.com/100x100?text=No+Image"
                  }
                  alt={conv.product_name}
                  className="conversation-image"
                />

                <div className="conversation-content">
                  <h3>{conv.product_name}</h3>
                  <p className="conversation-sender">{conv.sender_name}</p>
                  <p className="conversation-message">{conv.last_message}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversations;
