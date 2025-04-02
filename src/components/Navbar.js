import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import "../styles/Navbar.css";

function Navbar({ user, login, logout }) {
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (user?.uid) {
        console.log("Fetching user photo for UID:", user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const photo = userSnap.data().photoURL;
          console.log("Firestore PhotoURL:", photo);
          setProfilePic(photo || user.photoURL || "/default-profile.png"); // Fallback to default image
        } else {
          console.log("User not found in Firestore, using auth photoURL:", user.photoURL);
          setProfilePic(user.photoURL || "/default-profile.png");
        }
      }
    };

    if (user) {
      fetchUserPhoto();
    }
  }, [user]);

  return (
    <nav className="navbar">
      <h1>Placement Prep</h1>
      <div>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/post">Post a Question</Link>
            <button onClick={logout}>Logout</button>
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-pic"   referrerPolicy="no-referrer"
              />
            ) : (
              <p>Loading...</p>
            )}
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
