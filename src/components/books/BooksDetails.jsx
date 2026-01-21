import React, { useEffect, useEffectEvent, useState } from 'react'
import { X, BookOpen, User, Tag, Calendar, FileText, Hash, Layers, Clock, Edit, Phone, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/sanity/lib/client';



function CheckBookDueDate(due_date){
  const today = new Date();
  const dueDate = new Date(due_date);

  if(today > dueDate){
    return {
      status: 'overdue',
      color: 'text-red-600 font-bold'
    };
  }
  return {
    status: 'on time',
    color: 'text-green-600 font-bold'
  };
}

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

const BorrowersCard = ({bookId}) => {
  "use client"
   const [borrowers, setBorrowers] = useState([]);
   
   useEffect(() => {
   client.fetch(`*[_type == "borrowing" && book._ref == "${bookId}"]{
  book->{
    _id,
    title,
    author,
    coverImage
  },
  borrower->{
    _id,
    firstName,
    lastName,
    studentId,
    profilePicture
  },
  borrowedAt,
  returnDate,
  returnStatus,
  fine,
  notes
}`)
    .then((data) => {
      setBorrowers(data)
      console.log(data)
    })
    .catch((err) => console.log(err));
   }, [bookId]);
   

   useEffect(() => {
    console.log(borrowers)
   }, [borrowers]);


   // Animation variants for the container
   const container = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1
       }
     }
   };
   
   // Animation variants for each item
   const item = {
     hidden: { opacity: 0, y: 20 },
     show: { 
       opacity: 1, 
       y: 0,
       transition: {
         duration: 0.4,
         ease: 'easeOut'
       }
     },
     hover: {
       scale: 1.01,
       transition: {
         duration: 0.2
       }
     }
   };
   
   return (
    <motion.div 
      className="mt-6 space-y-4 overflow-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {borrowers.map((borrower) => (
        <motion.div 
          key={borrower?.borrower?._id} 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
          variants={item}
          whileHover="hover"
          layout
          transition={{ 
            layout: { duration: 0.3, ease: 'easeInOut' } 
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={borrower?.borrower?.profilePicture?.asset?.url || '/assets/purple.jpg'}
                alt={`${borrower?.borrower?.firstName} ${borrower?.borrower?.lastName}`}
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/purple.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {borrower?.borrower?.firstName} {borrower?.borrower?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      ID: {borrower?.borrower?.studentId || 'N/A'}
                    </span>
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  borrower?.returnStatus === 'returned' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {borrower?.returnStatus || 'Unknown'}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Borrowed On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(borrower?.borrowedAt) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Due Date</p>
                  <p className={`text-sm font-medium ${
                    new Date(borrower?.returnDate) < new Date() && borrower?.returnStatus !== 'returned'
                      ? 'text-red-600'
                      : 'text-gray-900'
                  } ${CheckBookDueDate(borrower?.returnDate).color}`}>
                    {formatDate(borrower?.returnDate) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Fine</p>
                  <p className="text-sm font-medium text-gray-900">
                    {borrower?.fine ? `$${parseFloat(borrower.fine).toFixed(2)}` : '$0.00'}
                  </p>
                </div>
              </div>
              
              {borrower?.notes && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500">Notes</p>
                  <p className="text-sm text-gray-600 italic">{borrower.notes}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
   )
}

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
                      <BorrowersCard bookId={specificBook._id}/>
                    </div>
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