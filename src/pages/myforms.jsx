import React, { useEffect, useState } from "react";
import Card from "../components/card";
import { useUserContext } from "../customHooks/UserContext";
import { useNavigate } from "react-router-dom";

async function fetchAllAds() {
    try {
        const response = await fetch("http://localhost:5000/getAllAds");
        const data = await response.json();
        return data.allAds;
    } catch (err) {
        console.log("FRONTEND : Error while fetching ads", err);
        return [];
    }
}

const MyForms = () => {
    const [filteredAds, setFilteredAds] = useState([]);
    const user = useUserContext();
    const navigate = useNavigate(); // Hook to navigate

    async function fetchAppliedForms() {
        try {
            return user.appliedForms;
        } catch (err) {
            console.log("FRONTEND : Error while fetching applied forms", err);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const ads = await fetchAllAds();
            const appliedForms = await fetchAppliedForms();

            const appliedFormIds = appliedForms.map(form => form.id);
            const matchedAds = ads.filter(ad => appliedFormIds.includes(ad.advertisementId));

            setFilteredAds(matchedAds);
        };

        fetchData();
    }, [user]);

    return (
        <div className="mt-[50px]">
            {/* Gradient Bar for Applied Forms and Username */}
            <div className="bg-gradient-to-r from-green-200 to-teal-300 dark:from-green-400 dark:to-teal-500 p-4 text-black dark:text-white rounded-md mb-6 flex justify-between items-center shadow-lg shadow-black/50 dark:shadow-white/15">
                <div className="text-lg font-semibold">
                    <p>Applied Forms by: <span className="font-bold">{user.name}</span></p>
                </div>
                <div className="text-sm">
                    <p className="italic">{filteredAds.length} matching forms found</p>
                </div>
            </div>

            {/* Display Filtered Ads */}
            {filteredAds.length > 0 ? (
                <div className="flex flex-col">
                    <div className="w-full grid grid-cols-1 gap-x-3 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                        {/* The flex-wrap property ensures the items will wrap if there isn't enough space */}
                        {filteredAds.map((element) => (
                            <Card key={element.advertisementId} advertisement={element} boo={false} />
                        ))}

                    </div>
                    {/* Go Back Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Go Back
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                    <p className="text-xl font-semibold text-red-500">No matching ads found.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">It looks like you haven't applied to any relevant ads yet.</p>
                    {/* Go Back Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Go Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyForms;
