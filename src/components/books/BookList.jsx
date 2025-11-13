'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const BookList = ({setSpecificBook}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
 const query = `*[_type == "book"] | order(_createdAt desc) {
  _id,
  title,
  author,
  description,
  coverImage {
    asset->{url},
    alt
  },
  "category": *[_type == "category" && _id == ^.category._ref][0] {
    _id,
    name
  },
  publisher,
  isbn,
  year,
  pages,
  stock,
  borrowed,
  // 👇 Capture the book ID here
  "bookId": _id,
  "borrowers": *[_type == "borrower" && references(^._id)] {
    _id,
    studentId,
    firstName,
    lastName,
    email,
    contactNumber,
    // 👇 Now match using bookId (from the parent)
    "borrowedBook": borrowedBooks[book._ref == ^.^.bookId] {
      borrowedAt,
      returnDate,
      returnStatus
    }
  },
  createdAt,
  updatedAt
}`;


        const result = await client.fetch(query);
        setBooks(result);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="text-center py-10 w-full flex flex-col justify-center items-center space-y-3 text-blue-500"><Loader2 size={20} className='animate-spin'/><span>Loading...</span></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {books.map((book, index) => (
        <motion.div
          key={book._id}
          className="relative group bg-white rounded-lg overflow-hidden shadow-md max-w-[220px] mx-auto hover:cursor-pointer"
          variants={item}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          onClick={() => setSpecificBook(book)}
        >
          {/* Book Cover */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={`${book.coverImage?.asset?.url}?w=300`}
              alt={book.coverImage?.alt || book.title}
              className="w-full h-full object-cover"
            />

            {/* Category Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300"
            >
              {book.category?.title && (
                <span className="text-white text-sm font-medium bg-white bg-opacity-10 px-3 py-1 rounded-full border border-white">
                  {book.category.title}
                </span>
              )}
            </motion.div>
          </div>

          {/* Book Info Container */}
          <div className="bg-gray-50 px-3 py-4 text-center">
            <h3 className="text-base font-semibold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <div className="text-xs text-gray-500 flex justify-center gap-3 mt-1">
              <span>{book.year}</span>
              <span>{book.pages} pages</span>
            </div>
          </div>

          {/* Description on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 text-xs text-gray-700 transition-all duration-300 group-hover:block hidden"
          >
            {book.description}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookList;