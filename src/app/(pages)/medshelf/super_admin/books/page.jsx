"use client"
import { ChevronDown, ChevronUp, Home, Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Mooli } from 'next/font/google'
import BookList from '@/components/books/BookList'

const mooli = Mooli({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

const menuItems = [
    { label: 'Manage Books', onClick: "" },
    { label: 'Add Book', onClick: "" },
    { label: 'Manage Borrowing', onClick: "" },
    { label: 'Manage Categories', onClick: "" },


];

const Books = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AnimatePresence>
      <div className={`w-full h-screen ${mooli.className}`}>
        {/* top navigation bar */}
      <div className='w-full min-h-10 py-5 bg-blue-200 flex flex-row items-center relative'>
        <div>
          <Link href='/medshelf/super_admin' className='hover:text-blue-700'>
            <Home className='ml-3'/>
          </Link>
        </div>
        <div className='absolute right-0 mr-5'>
          <div className='relative'>
            <button onClick={handleMenuClick} className='text-black font-bold px-3 py-1 rounded flex items-center hover:text-blue-800'>Manage Books
            {isMenuOpen ? <ChevronUp/> : <ChevronDown/>}
          </button>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden pb-4"
            >
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button onClick={item.onClick} className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100">
                    {item.label}
                  </button>
                </li>
              ))}
            </motion.div>
          )}
          </div>
        </div>
      </div>

      {/* main content */}
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Books</h1>
        <div className='space-y-6'>
          {/* search bar */}
          <div className='flex items-center justify-center space-x-2'>
            <input type="text" placeholder='Search books by name or id' className='min-w-1/4 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'/>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex flex-row items-center'> <Search size={15}/> Search</button>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden py-2 px-2 relative'>
            <p>Showing all books</p>
            <div className='absolute top-0 right-0 font-semibold mr-10 flex items-center h-full'>
              <h4>Showing result of 10 books</h4>
            </div>
          </div>

          {/* books list */}
          <BookList />
        </div>
      </div>
    </div>
    </AnimatePresence>
  )
}

export default Books