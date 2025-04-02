import React, { useEffect, useState } from "react";
import { db, collection, getDocs, query, orderBy } from "../firebase";
import QuestionCard from "../components/QuestionCard";
import "../styles/Home.css";

function Home({ user }) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedQuestions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(fetchedQuestions);
      setFilteredQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, []);

  // Function to filter questions by category
  const filterQuestions = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
    if (category === "ALL") {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter((q) => q.questionType === category));
    }
  };

  // Calculate Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Pagination Handlers
  const nextPage = () => {
    if (indexOfLastQuestion < filteredQuestions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="home-container">
      <h2>Questions</h2>

      {/* Category Buttons */}
      <div className="category-buttons">
        {["ALL", "DSA", "APTITUDE", "REASONING", "ENGLISH"].map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => filterQuestions(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} user={user} />
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={indexOfLastQuestion >= filteredQuestions.length}>
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default Home;
