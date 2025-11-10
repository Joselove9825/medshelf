'use client';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
import { Mooli } from 'next/font/google';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaUser, FaPlus, FaFile, FaChartLine, FaUserPlus, FaUserCog } from 'react-icons/fa';
import { LineChart_medshelf, BarChart_medshelf }from '@/components/super_admin/charts/charts';

const mooli = Mooli({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const Home = () => {
const [user, setUser] = useState(null);

  const getUserData = async () => {
    const idb_user_data = await get("user");
    return idb_user_data;
  }

  const links = [
    {name: "Manage Staff" , href: "/medshelf/super_admin/staff", icon: FaUserCog},
    {name: "Books Management" , href: "/medshelf/super_admin/books", icon: FaBook},
    {name: "Borrowers Management", href: "/medshelf/super_admin/borrowers", icon: FaUser},
    {name: "Add Books", href: "/medshelf/super_admin/add_books", icon: FaPlus},
    {name: "Add Borrowers", href: "/medshelf/super_admin/add_borrowers", icon: FaUserPlus},
    {name: "Generate Reports", href:"/medshelf/super_admin/generate_reports", icon: FaFile}
  ]
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        console.log('User data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
    <div className={`h-screen w-full ${mooli.className}`}>
      <div className='w-full h-15 mt-2 bg-blue-50 flex flex-row relative'>
        <div className={`font-bold text-xl ml-2 ${mooli.className} h-auto flex items-center`}><span className='text-blue-500'>Med</span>Shelf</div>
        <div className='w-full flex justify-end gap-2'>
          <Image src='/assets/purple.jpg' width={25} height={25} alt='MedShelf' className='rounded-full h-8 w-8' />
          <div className='flex flex-col'>
            <div>{user?.name}</div>
            <div>{user?.email}</div>
            <div>{user?.role}</div>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className='w-full flex justify-center mb-8'>
        <div className='flex flex-row gap-6 px-6 py-3 rounded-lg bg-white shadow-sm w-full max-w-4xl mx-auto justify-center'>
          {links.map((link, index) => (
            <motion.div 
              key={index} 
              className='relative group'
              whileHover="hover"
              initial="initial"
            >
              <Link 
                href={link.href} 
                className='flex flex-col items-center px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 w-16'
              >
                <motion.div
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.1 }
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <link.icon className="text-blue-600 text-lg"/>
                </motion.div>
                <motion.span 
                  className={`${mooli.className} text-xs font-medium absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-100 text-blue-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                >
                  {link.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className='w-full max-w-6xl mx-auto mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-4'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-500 text-sm font-medium'>Total Books</h3>
            <p className='text-2xl font-bold text-blue-600'>0</p>
            <p className='text-xs text-gray-500 mt-1'>Available in the library</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-500 text-sm font-medium'>Borrowers</h3>
            <p className='text-2xl font-bold text-green-600'>0</p>
            <p className='text-xs text-gray-500 mt-1'>Active members</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-500 text-sm font-medium'>Reports</h3>
            <p className='text-2xl font-bold text-purple-600'>0</p>
            <p className='text-xs text-gray-500 mt-1'>Generated this month</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='w-full max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-700 font-medium mb-4'>Weekly Activity</h3>
            <div className='h-64'>
              <LineChart_medshelf />
            </div>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-700 font-medium mb-4'>Monthly Overview</h3>
            <div className='h-64'>
              <BarChart_medshelf />
            </div>
          </div>
        </div>
      </div>

      {/* other stats */}
      <div className='w-full h-full max-h-100 max-w-6xl mx-auto mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 px-4'>
          <div className='bg-white shadow-gray-300 shadow-sm p-4 rounded-lg'>
            <h3 className='text-black font-bold mb-4'>Recent Activity</h3>
            <p className='text-gray-500 text-sm'>Total users: 0</p>
            <p className='text-gray-500 text-sm'>Total books: 0</p>
            <p className='text-gray-500 text-sm'>Total reports: 0</p>
          </div>

          <div className='bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-100'>
            <h3 className='text-gray-700 font-medium mb-4'>System Stats</h3>
            <p className='text-gray-500 text-sm'>Total users: 0</p>
            <p className='text-gray-500 text-sm'>Total books: 0</p>
            <p className='text-gray-500 text-sm'>Total reports: 0</p>
          </div>
          </div>
        </div>
      </div>
  )
}

export default Home