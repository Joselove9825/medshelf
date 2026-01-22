"use client"
import { ChevronDown, ChevronUp, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const menuItems = [
    { label: 'View Books', path: '/medshelf/super_admin/books' },
    { label: 'Add Book', path: '/medshelf/super_admin/books/add' },
    { label: 'Manage Borrowing', path: '/medshelf/super_admin/books/manage_borrowing' },
    { label: 'Manage Categories', path: '/medshelf/super_admin/categories' },
];

export default function BooksNavbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [specificBook, setSpecificBook] = useState(null);

    const handleMenuClick = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    
    const handleMenuItemClick = (path) => {
      // You can add additional logic here if needed
      router.push(path);
      setIsMenuOpen(false);
    };
    return (
        <div className='w-full min-h-10 py-5 bg-blue-200 flex flex-row items-center relative'>
        <div>
          <Link href='/medshelf/super_admin' className='hover:text-blue-700'>
            <Home className='ml-3' size={20}/>
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
                  <Link 
                    href={item.path}
                    className="block px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </motion.div>
          )}
          </div>
        </div>
      </div>
    );
}