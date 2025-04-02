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
      try {
        const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Questions:", fetchedQuestions); // ✅ Debugging Fetch
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedCategory === "ALL") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (q) => q.questionType?.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log(`Filtering for ${selectedCategory}:`, filtered); // ✅ Debugging Filter
      setFilteredQuestions(filtered);
    }
    setCurrentPage(1);
  }, [questions, selectedCategory]);

  // Pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  return (
    <div className="home-container">
      <h2>Questions</h2>

      {/* Category Buttons */}
      <div className="category-buttons">
        {["ALL", "DSA", "APTITUDE", "REASONING", "ENGLISH"].map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => {
              console.log("Category selected:", category); // ✅ Debugging Category Change
              setSelectedCategory(category);
            }}
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
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅️ Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => (indexOfLastQuestion < filteredQuestions.length ? prev + 1 : prev))}
          disabled={indexOfLastQuestion >= filteredQuestions.length}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default Home;
