import React, { useState, useEffect } from "react";
import { db, doc, updateDoc, getDoc, collection, addDoc, getDocs, setDoc, deleteDoc } from "../firebase";
import "../styles/QuestionCard.css";

function QuestionCard({ question, user }) {
  const [likes, setLikes] = useState(question.likes);
  const [dislikes, setDislikes] = useState(question.dislikes);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    const commentsRef = collection(db, `questions/${question.id}/comments`);
    const querySnapshot = await getDocs(commentsRef);
    const fetchedComments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(fetchedComments);
  };

  const postComment = async () => {
    if (!user) {
      setMessage("Please login first!");
      return;
    }
    if (!commentText.trim()) return;
  
    console.log("Posting comment:", commentText, user);
  
    await addDoc(collection(db, `questions/${question.id}/comments`), {
      comment: commentText,
      user: {  // Ensure user is an object
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      },
      timestamp: new Date(),
    });
  
    setCommentText("");
    fetchComments();
  };
  

  return (
    <div className="question-card">
      <h3>{question.text}</h3>
      <p><strong>Company:</strong> {question.company || "N/A"}</p>
      <p><strong>Category:</strong> {question.questionType}</p>
      <p>Likes: {likes} | Dislikes: {dislikes}</p>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <div className="like-dislike-buttons">
        <button className="like-button" onClick={() => setLikes(likes + 1)}>👍 Like</button>
        <button className="dislike-button" onClick={() => setDislikes(dislikes + 1)}>👎 Dislike</button>
      </div>

      <button className="comment-toggle" onClick={() => setShowComments(!showComments)}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {showComments && (
        <div className="comments-section">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <img src={c.user.photoURL} alt={c.user.name} className="comment-user-photo" />
                <div className="comment-content">
                  <p><strong>{c.user.name}</strong></p>
                  <p>{c.comment}</p>
                  <small>{new Date(c.timestamp.seconds * 1000).toLocaleString()}</small>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          {user ? (
            <div className="comment-input">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
              />
              <button onClick={postComment}>Post</button>
            </div>
          ) : (
            <p>Please login to comment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
