import React, { useState } from "react";
import { db, collection, addDoc } from "../firebase";
import "../styles/PostQuestion.css";

function PostQuestion({ user }) {
  const [questionText, setQuestionText] = useState("");
  const [company, setCompany] = useState("");
  const [questionType, setQuestionType] = useState("DSA");

  const postQuestion = async () => {
    if (!questionText.trim()) return;

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

    setQuestionText("");
    setCompany("");
  };

  return (
    <div className="form">
      <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Enter question" />
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
