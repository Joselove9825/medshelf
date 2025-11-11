'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { motion } from 'framer-motion';

const BookList = () => {
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
          coverImage{
            asset->{
              url
            },
            alt
          },
          category->{
            title
          },
          year,
          pages
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

  if (loading) return <div className="text-center py-10">Loading books...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <motion.div
          key={book._id}
          className="relative group bg-white rounded-lg overflow-hidden shadow-md max-w-[220px] mx-auto"
          whileHover={{ scale: 1.02 }}
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
    </div>
  );
};

export default BookList;
