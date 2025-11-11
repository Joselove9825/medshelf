'use client';
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import { get } from 'idb-keyval'
import { Mooli } from 'next/font/google';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaUser, FaPlus, FaFile, FaChartLine, FaUserPlus, FaUserCog } from 'react-icons/fa';
import { LineChart_medshelf, BarChart_medshelf }from '@/components/super_admin/charts/charts';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/auth_context';
import { Fetch_Staff_Count, Fetch_Users } from '@/server/super_admin/users';
import CountUp from 'react-countup';

const mooli = Mooli({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
      damping: 10
    }
  }
};

const cardHover = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 300 }
};

const cardTap = {
  scale: 0.98
};

const Home = () => {
  const [user, setUser] = useState(null);
  const {authenticated} = useAuth();
  const [dashbard_info, setDashboardInfo] = useState({ all_staff_count: 0 });

  if(!authenticated){
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const getUserData = async () => {
    const idb_user_data = await get("user");
    return idb_user_data;
  }



  const links = [
    {name: "Manage Staff" , href: "/medshelf/super_admin/manage_staff", icon: FaUserCog},
    {name: "Books Management" , href: "/medshelf/super_admin/books", icon: FaBook},
    {name: "Borrowers Management", href: "/medshelf/super_admin/borrowers", icon: FaUser},
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
    
    const all_staff_count = async () => {
      try {
        const response = await Fetch_Staff_Count();
        console.log('Staff count response:', response);
        
        if (response?.success) {
          // The count is directly in response.data as a number
          const count = typeof response.data === 'number' ? response.data : 0;
          
          setDashboardInfo(prev => ({
            ...prev,
            all_staff_count: count
          }));
        } else {
          console.warn('Failed to fetch staff count:', response);
          setDashboardInfo(prev => ({
            ...prev,
            all_staff_count: 0
          }));
        }
      } catch (error) {
        console.error('Error fetching staff count:', error);
        setDashboardInfo(prev => ({
          ...prev,
          all_staff_count: 0
        }));
      }
    };

    all_staff_count();
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

      {/* Dashboard Cards */}
      <motion.div 
        className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6'
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Total Books</h3>
          <motion.p 
            className='text-2xl font-bold text-blue-600'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            0
          </motion.p>
          <p className='text-xs text-gray-500 mt-1'>Available in the library</p>
        </motion.div>

        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Borrowers</h3>
          <motion.p 
            className='text-2xl font-bold text-green-600'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            0
          </motion.p>
          <p className='text-xs text-gray-500 mt-1'>Active members</p>
        </motion.div>

        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Total Books Borrowed</h3>
          <motion.p 
            className='text-2xl font-bold text-red-600'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            0
          </motion.p>
          <p className='text-xs text-gray-500 mt-1'>Number of books borrowed</p>
        </motion.div>

        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Overdue Books</h3>
          <motion.p 
            className='text-2xl font-bold text-amber-600'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            0
          </motion.p>
          <p className='text-xs text-gray-500 mt-1'>Number of exceeding return date</p>
        </motion.div>

        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Total Staff</h3>
          <motion.div 
            className='text-2xl font-bold text-fuchsia-500'
          >
            <CountUp
              end={dashbard_info.all_staff_count}
              duration={2.5}
              separator=','
              useEasing={true}
              enableScrollSpy={true}
              scrollSpyOnce={true}
            />
          </motion.div>
          <p className='text-xs text-gray-500 mt-1'>Staff Count</p>
        </motion.div>

        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer'
          variants={item}
          whileHover={cardHover}
          whileTap={cardTap}
        >
          <h3 className='text-gray-500 text-sm font-medium'>Reports</h3>
          <motion.p 
            className='text-2xl font-bold text-purple-600'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            0
          </motion.p>
          <p className='text-xs text-gray-500 mt-1'>Generated this month</p>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'
          whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Monthly Book Loans</h3>
          <LineChart_medshelf />
        </motion.div>
        <motion.div 
          className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'
          whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        >
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Books by Category</h3>
          <BarChart_medshelf />
        </motion.div>
      </motion.div>

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