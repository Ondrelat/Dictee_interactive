'use client'
import { useState } from 'react';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (

    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center px-4 py-2 rounded bg-white focus:outline-none"
      >
        <svg className="fill-current h-6 w-6 text-black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0zM0 9h20v2H0zM0 15h20v2H0z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg z-10">
          <a href="/contact" className="block px-4 py-2 text-white hover:bg-gray-800">contact</a>
        </div>
      )}
    </div>


  );
};

export default DropdownMenu;
