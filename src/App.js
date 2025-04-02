import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PostQuestion from "./pages/PostQuestion";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) return;
      setUser(user);  // Save user in state
      console.log("User logged in:", user);  // Debugging

      // Reference to Firestore document
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // If user does not exist in Firestore, store details
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL || "", // Ensure `photoURL` is saved
        });
        console.log("New user added to Firestore");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <Router>
      <Navbar user={user} login={login} logout={logout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/post" element={user ? <PostQuestion user={user} /> : <p>Please login to post a question</p>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
