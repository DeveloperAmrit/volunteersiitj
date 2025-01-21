import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import MakeAdvertisement from './pages/makeAdvertisement';
import ContactUs from './pages/contactUs';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutUs from './pages/aboutus';
import ShowAd from './pages/showAd';
import ShowNews from './pages/showNews';
import { useUserContext } from './customHooks/UserContext';
import MakeNews from './pages/makeNews';
import ErrorPage from './pages/error';
import Profile from './pages/profile';
import Loading from './components/loading';
import ShowForm from './pages/showForm';
import MyForms from './pages/myforms';

function App() {
  const user = useUserContext();
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      setLoading(false); // Assuming user data is loaded once the context is available
    }
  }, [user]);

  useEffect(() => {
    const homey = localStorage.getItem('homeY');
    if (homey && pathname === '/') {
      window.scrollTo(0, homey);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-black min-h-screen">
      <div className="max-w-7xl w-11/12 mx-auto px-4 pt-4 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showAd" element={user.name ? <ShowAd /> : <Navigate to="/error" replace />} />
          <Route path="/showNews" element={user.name ? <ShowAd /> : <Navigate to="/error" replace />} />
          <Route path="/showForm" element={user.name ? <ShowForm /> : <Navigate to="/error" replace />} />
          <Route path="/contactus" element={user.name ? <ContactUs /> : <Navigate to="/error" replace />} />
          <Route path="/aboutus" element={user.name ? <AboutUs /> : <Navigate to="/error" replace />} />
          <Route path="/profile" element={user.name ? <Profile /> : <Navigate to="/error" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/profile/myforms" element={user.name ? <MyForms /> : <Navigate to="/error" replace />} />

          {user.isAdvertiser && (
            <>
              <Route path="/makeNews" element={<MakeNews />} />
              <Route path="/advertiserDashboard" element={<MakeNews />} />
              <Route path="/makeAdvertisement" element={<MakeAdvertisement />} />
            </>
          )}

          {!user.isAdvertiser && (
            <>
              <Route path="/makeNews" element={<ErrorPage />} />
              <Route path="/advertiserDashboard" element={<ErrorPage />} />
              <Route path="/makeAdvertisement" element={<ErrorPage />} />
            </>
          )}
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
