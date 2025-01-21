import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js"; // Import your Firebase config
import { useUserDispatchContext } from '../customHooks/UserContext.jsx';
import { validColleges } from '../data/validColleges.js';
import { validAdvertisers } from '../data/validAdvertisers.js';
import { validDevelopers } from '../data/validDevelopers.js';
import { useNavigate } from 'react-router-dom';


export default function SignUpPage() {
  const dispatch = useUserDispatchContext();
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Get user info

      const college = validColleges[user.email.substring(user.email.indexOf('@'),user.email.length+1)] || 'NONE';
      const body = {
        name: user.displayName,
        userId: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        college: college,
        isAdvertiser: validAdvertisers.includes(user.email),
        isDeveloper: validDevelopers.includes(user.email)
      }
      dispatch({
        type: 'login',
        ...body
      })
      try{
        const response = await fetch('http://localhost:5000/createUser',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json", // Content type of the request body
          },
          body: JSON.stringify(body)
        })
        const data = await response.json(); // Parse the JSON from the response
        console.log(data.message);
      }
      catch(err){
        console.log("Failed to register user in database",err);
      }
      console.log("User signed up:", user);
    } catch (error) {
    }
    navigate('/', {
      state: {title:'Welcome', message:'Successfully created your account'}
    });
    window.location.reload();
  };

  return (
    <div className="mt-[50px] min-h-screen flex items-center justify-center transition-colors duration-500 dark:bg-gray-900 bg-gray-100">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-gray-700/50">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white animate-fadeIn">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 animate-fadeIn">
          Join us and start your journey.
        </p>
          <button
          onClick={handleGoogleSignUp}
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Sign up with Google
          </button>
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-pink-500 hover:text-pink-700 dark:hover:text-pink-300"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}