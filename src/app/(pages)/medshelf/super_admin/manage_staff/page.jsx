"use client"
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Home, Loader2, Pencil, Plus, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { Mooli } from 'next/font/google';
import { useAuth } from '@/context/auth_context';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Fetch_Users, Delete_Users } from '@/server/super_admin/users';
import AddStaffModal from '@/components/super_admin/add_staff_modal/add_staff_modal';

const mooli = Mooli({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

const roleConfig = {
    'super_admin': {
        title: 'Super Admins',
        color: 'bg-purple-100 text-purple-800',
        textColor: 'text-purple-800'
    },
    'admin': {
        title: 'Admins',
        color: 'bg-blue-100 text-blue-800',
        textColor: 'text-blue-800'
    },
    'libarian': {
        title: 'Librarians',
        color: 'bg-green-100 text-green-800',
        textColor: 'text-green-800'
    }
};

const ManageStaff = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [usersByRole, setUsersByRole] = useState({});
    const { authenticated } = useAuth();
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        if (!authenticated) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }

        try {
            setLoading(true);
            const response = await Fetch_Users();
            if (response.success) {
                const groupedUsers = groupUsersByRole(response.data);
                setUsersByRole(groupedUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load staff members');
        } finally {
            setLoading(false);
        }
    };

    const groupUsersByRole = (users) => {
        const grouped = {};
        Object.keys(roleConfig).forEach(role => {
            grouped[role] = [];
        });

        users?.forEach(user => {
            const roles = Array.isArray(user.role) ? user.role : [user.role];
            roles.forEach(role => {
                if (grouped[role]) {
                    grouped[role].push(user);
                }
            });
        });

        return grouped;
    };

    const handleDeleteAccount = async (userId) => {
        setUserToDelete(usersByRole[Object.keys(usersByRole).find(role => 
            usersByRole[role].some(user => user._id === userId)
        )].find(user => user._id === userId));
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        
        try {
            const response = await Delete_Users(userToDelete._id);
            if (response.success) {
                toast.success('Staff member deleted successfully');
                setUserToDelete(null);
                fetchUsers();
            } else {
                throw new Error(response.message || 'Failed to delete staff member');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            toast.error(error.message || 'An error occurred while deleting the staff member');
            setUserToDelete(null);
        }
    };

    const handleUpdate = (user) => {
        setEditingUser(user);
        setIsAddStaffModalOpen(true);
    };

    const handleStaffAdded = () => {
        fetchUsers();
        toast.success('Staff member added successfully');
    };

    useEffect(() => {
        if (updateSuccess) {
            fetchUsers();
            setUpdateSuccess(false);
        }
    }, [updateSuccess]);

    useEffect(() => {
        fetchUsers();
    }, [authenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="mt-2 text-gray-600">Loading staff members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full bg-gray-50 ${mooli.className} relative`}>
            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => {
                    setIsAddStaffModalOpen(false);
                    setEditingUser(null);
                }}
                onStaffAdded={handleStaffAdded}
                isUpdate={!!editingUser}
                user_info={editingUser}
                setUpdateSuccess={setUpdateSuccess}
            />

            <div className='w-full h-16 bg-blue-100 flex items-center px-4 shadow-sm'>
                <Link href="/medshelf/super_admin" className='text-black p-2 rounded-md hover:bg-blue-200 transition-colors'>
                    <Home size={20} />
                </Link>
                <div className='ml-auto'>
                    <button 
                        onClick={() => {
                            setEditingUser(null);
                            setIsAddStaffModalOpen(true);
                        }} 
                        className='flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm'
                    >
                        <Plus size={18} />
                        Add Staff
                    </button>
                </div>
            </div>

            <div className='p-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-6'>Staff Management</h1>
                
                <div className="space-y-6">
                    {Object.entries(roleConfig).map(([role, config]) => {
                        const usersInRole = usersByRole[role] || [];
                        return (
                            <div key={role} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className={`px-6 py-3 ${config.color} font-medium`}>
                                    {config.title} ({usersInRole.length})
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {usersInRole.length > 0 ? (
                                        usersInRole.map((user, index) => {
                                            const uniqueKey = `${user._id}-${index}`;
                                            const isHovered = hoveredCard === uniqueKey;
                                            
                                            return (
                                                <div 
                                                    key={uniqueKey}
                                                    className="p-4 hover:bg-gray-50 relative group"
                                                    onMouseEnter={() => setHoveredCard(uniqueKey)}
                                                    onMouseLeave={() => setHoveredCard(null)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className='flex items-center space-x-4'>
                                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                                <Image 
                                                                    src={
                                                                        user?.profile_picture?.asset?.url || 
                                                                        (typeof user?.profile_picture === 'string' ? 
                                                                            user.profile_picture : 
                                                                            '/assets/purple.jpg'
                                                                        )
                                                                    }
                                                                    alt={`${user.first_name} ${user.last_name}`}
                                                                    width={48}
                                                                    height={48}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/assets/purple.jpg';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">
                                                                    {user.first_name} {user.last_name}
                                                                </h3>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                                {user.phone_number && (
                                                                    <p className="text-xs text-gray-500">
                                                                        Phone: {user.phone_number}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                                                                {config.title}
                                                            </span>
                                                            
                                                            {(user.role?.[0] === 'admin' || user.role?.[0] === 'libarian') && (
                                                                <div 
                                                                    className={`flex items-center space-x-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                                                >
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdate(user);
                                                                        }}
                                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                                                    >
                                                                        <Pencil size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteAccount(user._id);
                                                                        }}
                                                                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                                                    >
                                                                        <Trash size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {user.status && (
                                                        <div className="mt-2">
                                                            <span className={`text-xs ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                                Status: {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No {config.title.toLowerCase()} found
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                                <button 
                                    onClick={() => setUserToDelete(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}? 
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;