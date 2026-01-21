"use client"
import { ChevronDown, ChevronUp, Filter, Home, Plus, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Mooli } from 'next/font/google'
import BookList from '@/components/books/BookList'
import BooksDetails from '@/components/books/BooksDetails'

const mooli = Mooli({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

const Books = () => {
  const [specificBook, setSpecificBook] = useState(null);

  return (
    <AnimatePresence>
      <div className={`w-full h-screen ${mooli.className} `}>
        {/* top navigation bar */}
      

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
          {/* filter toggler */}
          <div className='w-full min-w-2xl flex justify-end'>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex flex-row items-center'> <Filter size={15}/> Filter</button>
          </div>
          {/* books list */}
          <BookList setSpecificBook={setSpecificBook}/>

          {/* book info */}
          {specificBook && (
            <BooksDetails specificBook={specificBook} setSpecificBook={setSpecificBook}/>
          )}
          {/* book info end */}

        </div>
      </div>
    </div>
    </AnimatePresence>
  )
}

export default Books