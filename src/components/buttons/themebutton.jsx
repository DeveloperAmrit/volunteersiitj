import React, { useState, useEffect } from 'react';

const ToggleTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="bg-transparent mx-1 px-2 py-1 text-lg rounded hover:bg-gray-100 hover:scale-105 border border-gray-400  dark:border-white hover:border-black transition-transform dark:hover:bg-gray-950 dark:hover:border dark:hover:border-white"
        >
            {darkMode ? <img src='/assets/images/dark.svg' alt="Dark" className='p-[1px] h-[15px] w-[15px] md:h-[26px] md:w-[26px] invert bg-transparent' /> : <img src='/assets/images/light.svg' alt="Light" className='p-[1px] h-[16px] w-[16px] md:h-[26px] md:w-[26px] bg-transparent' />}
        </button>
    );
};

export default ToggleTheme;
