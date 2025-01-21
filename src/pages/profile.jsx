import React, { useState, useEffect } from "react";
import { useUserContext } from "../customHooks/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

const Profile = () => {
    const [data, setData] = useState();
    const user = useUserContext();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('http://localhost:5000/getUser', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.userId,
                }),
            });
            let d = await response.json();
            setData(d.user);
        };
        fetchUserData();
    }, [user.userId]);
    const handleApplied = () => {
        navigate('/profile/myforms')
    }

    return (
        <div className="w-full mt-[50px] mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 flex flex-col relative">
            <div className="w-full mx-auto px-[50px] bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col md:flex-row items-center">
                {data ? (
                    <>
                        <div className="flex flex-col items-start w-full space-y-4">
                            <h1 className="md:text-4xl text-3xl font-extrabold text-gray-800 dark:text-white">User Profile</h1>
                            <h2 className="md:text-3xl text-2xl font-bold text-gray-800 dark:text-white">{data.name}</h2>
                            <p className="md:text-2xl text-xl text-gray-800 dark:text-white">{data.email}</p>
                            <p className="text-lg text-gray-600 dark:text-gray-300">{data.college}</p>
                        </div>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-gradient-to-r from-teal-400 to-blue-500 shadow-lg ml-0 mt-6 md:mt-0">
                            <img
                                src={data.photoURL || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </>
                ) : (
                    <Loading />
                )}
            </div>
            <div className="flex">
                <button className="w-[175px] h=[700px] md:mx-11 mx-auto px-6 py-2 mt-5 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md transition duration-300 transform hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleApplied}>
                    Applied Forms
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="w-[175px] h=[700px] md:mx-11 mx-auto px-6 py-2 mt-5 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md transition duration-300 transform hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Profile;
