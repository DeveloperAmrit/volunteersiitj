import React, { useEffect, useState } from 'react';

const SearchBox = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleClick = () => {
        onSearch(query)
    };
    useEffect(() => {
        if (query === '' || !query) {
            onSearch(query)
        }
    }, [query])

    return (
        <div className='max-w-96 flex justify-center items-center gap-2'>
            <input
                type="text"
                placeholder='Search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='text-black p-1 transition-transform duration-300 hover:scale-105 focus:scale-105 border-2 border-black'
            />
            <button onClick={handleClick} className='px-2 h-8 bg-white border-2 border-transparent border-black active:bg-gray-100 transition-transform duration-300 hover:scale-110'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
            </button>
        </div>
    );
};

export default SearchBox;
