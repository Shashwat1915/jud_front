import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";

export default function LibraryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchLibrary = async () => {
      const q = query(collection(db, "library"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchLibrary();
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Library</h1>
        <p>All your saved predictions, analyses, arguments, and more.</p>
      </div>

      {loading ? (
        <p>Loading your saved content...</p>
      ) : items.length === 0 ? (
        <p>No saved items yet. Generate something and click “Add to Library”.</p>
      ) : (
        <div className="bento-grid">
          {items.map(item => (
            <div key={item.id} className="bento-card span-1">
              <h3>{item.title}</h3>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Saved:</strong> {new Date(item.timestamp).toLocaleString()}</p>
              <pre style={{
                background: "var(--bg-main)",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "0.9rem",
                overflowX: "auto"
              }}>{JSON.stringify(item.content, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
