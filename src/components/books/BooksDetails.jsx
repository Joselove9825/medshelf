import React, { useEffect, useState } from 'react'
import { X, BookOpen, User, Tag, Calendar, FileText, Hash, Layers, Clock, Edit, Phone, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';

const BookDetailItem = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-start py-3 border-b border-gray-100 ${className}`}>
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
      <Icon size={16} />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-gray-900">
        {typeof value === 'number' ? value : (value || 'N/A')}
      </p>
    </div>
  </div>
)



const BorrowersCard = ({ borrower }) => {
    "use client"
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
        damping: 12
      }
    },
    hover: {
      scale: 1.01,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: { duration: 0.2 }
    }
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className='w-full py-4 flex flex-col overflow-y-auto max-h-[200px]'
      initial="hidden"
      animate={isMounted ? "show" : "hidden"}
      variants={container}
    >
      <div className='flex items-center gap-2 mb-2'>
        <h1 className='text-md font-bold text-gray-600'>Borrowers</h1>
        {borrower?.length > 0 && (
          <motion.span 
            className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'
            variants={countVariants}
          >
            {borrower.length}
          </motion.span>
        )}
      </div>
      
      <motion.div className='mt-2 w-full space-y-2' variants={container}>
        <AnimatePresence>
          {borrower?.map((borrower, index) => (
            <motion.div 
              key={borrower._id || index}
              className='flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100'
              variants={item}
              whileHover="hover"
              layout
            >
              <motion.div 
                className='w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 flex items-center justify-center text-blue-600 text-xs font-bold border-2 border-white shadow-sm'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
              >
                {borrower?.firstName?.[0]?.toUpperCase()}
              </motion.div>
              <div className='min-w-0'>
                <p className='text-sm font-medium text-gray-700 truncate'>
                  {borrower?.firstName} {borrower?.lastName}
                </p>
                <p className='text-xs text-gray-500 truncate'>
                  <span className='font-semibold'>ID:</span> {borrower?.studentId}
                </p>
                {borrower?.borrowedBook?.[0]?.returnDate && (
                  <motion.p 
                    className='text-xs font-medium mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full inline-flex items-center'
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Clock size={10} className='mr-1' />
                    Due: {new Date(borrower.borrowedBook[0].returnDate).toLocaleDateString()}
                  </motion.p>
                )}
                <div className='flex flex-col gap-0.5 mt-1'>
                  <a 
                    href={`mailto:${borrower?.email}`}
                    className='text-xs text-blue-600 hover:underline flex items-center'
                  >
                    <Mail size={10} className='mr-1' />
                    <span className='truncate'>{borrower?.email}</span>
                  </a>
                  <a 
                    href={`tel:${borrower?.contactNumber}`}
                    className='text-xs text-gray-500 hover:text-blue-600 flex items-center'
                  >
                    <Phone size={10} className='mr-1' />
                    {borrower?.contactNumber}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const BooksDetails = ({ specificBook, setSpecificBook }) => {
    "use client"
  if (!specificBook) return null;


  useEffect(() => {
    console.log(specificBook)
  }, [specificBook]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="book-details-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm transition-opacity z-[-1]" 
          aria-hidden="true"
          onClick={() => setSpecificBook(null)}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2" id="book-details-title">
                      {specificBook.title}
                    </h3>
                    <p className="text-gray-600 mb-6">by {specificBook.author}</p>
                  </div>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setSpecificBook(null)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {/* Left Column */}
                  <div className="sm:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <img
                        src={specificBook.coverImage?.asset?.url}
                        alt={specificBook.title}
                        className="mx-auto h-64 w-auto object-contain"
                      />
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <BookDetailItem 
                        icon={BookOpen} 
                        label="Pages" 
                        value={specificBook.pages ? `${specificBook.pages} pages` : null} 
                      />
                      <BookDetailItem 
                        icon={Tag} 
                        label="Category" 
                        value={specificBook.category?.name} 
                      />
                      <BookDetailItem 
                        icon={Hash} 
                        label="ISBN" 
                        value={specificBook.isbn} 
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="sm:col-span-1">
                    <div className="bg-white overflow-hidden">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
                        <p className="text-gray-600 leading-relaxed">
                          {specificBook.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <BookDetailItem 
                          icon={Layers} 
                          label="In Stock" 
                          value={specificBook.stock} 
                          className="col-span-1"
                        />
                        <BookDetailItem 
                          icon={User} 
                          label="Borrowed" 
                          value={specificBook.borrowed} 
                          className="col-span-1"
                        />
                        <BookDetailItem 
                          icon={Calendar} 
                          label="Published Year" 
                          value={specificBook.year} 
                        />
                        <BookDetailItem 
                          icon={Clock} 
                          label="Created" 
                          value={formatDate(specificBook.createdAt)} 
                        />
                        <BookDetailItem 
                          icon={Edit} 
                          label="Last Updated" 
                          value={formatDate(specificBook.updatedAt)} 
                        />
                      </div>
                    </div>
                    <BorrowersCard borrower={specificBook.borrowers}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setSpecificBook(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BooksDetails