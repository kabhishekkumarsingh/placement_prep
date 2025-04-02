import React, { useState } from "react";
import { db, collection, addDoc } from "../firebase";
import "../styles/PostQuestion.css";

function PostQuestion({ user }) {
  const [questionText, setQuestionText] = useState("");
  const [company, setCompany] = useState("");
  const [questionType, setQuestionType] = useState("DSA");

  const postQuestion = async () => {
    if (!questionText.trim()) return;

    try {
      await addDoc(collection(db, "questions"), {
        text: questionText,
        company: company || "N/A",
        questionType,
        user: {
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
        },
        likes: 0,
        dislikes: 0,
        timestamp: new Date(),
      });

      alert("Question added successfully!"); // ✅ Success Message
      setQuestionText("");
      setCompany("");
    } catch (error) {
      alert("Error adding question: " + error.message); // ❌ Error Handling
    }
  };

  return (
    <div className="form">
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter question"
        rows="4"
      />
      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name (Optional)" />
      <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
        <option value="DSA">DSA</option>
        <option value="Aptitude">Aptitude</option>
        <option value="Reasoning">Reasoning</option>
        <option value="English">English</option>
      </select>
      <button onClick={postQuestion}>Post Question</button>
    </div>
  );
}

export default PostQuestion;
