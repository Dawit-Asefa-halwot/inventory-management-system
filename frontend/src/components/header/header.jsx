import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Settings, X, Sun, Moon } from 'lucide-react';
// import { signOut } from '../../lib/auth';
// import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../ThemeProvider';
import io from 'socket.io-client';

const Header = ({ userName, userAvatar }) => {
     const [isProfileOpen, setIsProfileOpen] = useState(false);
     const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
     const [notifications, setNotifications] = useState([]);
     const [unreadCount, setUnreadCount] = useState(0);
     const navigate = useNavigate();
     // const { user } = useAuth();
     const { theme, toggleTheme } = useTheme();
     const [socket, setSocket] = useState(null);

     useEffect(() => {
          // Initialize WebSocket connection
          const newSocket = io('http://localhost:5000');
          setSocket(newSocket);

          // Fetch initial notifications
          fetchNotifications();

          // Listen for new notifications
          newSocket.on('new-notification', (notification) => {
               setNotifications(prev => [notification, ...prev]);
               setUnreadCount(prev => prev + 1);
          });

          return () => {
               newSocket.disconnect();
          };
     }, []);

     const fetchNotifications = async () => {
          try {
               const response = await fetch('http://localhost:5000/api/notifications');
               const data = await response.json();
               setNotifications(data);
               setUnreadCount(data.filter(n => !n.read).length);
          } catch (error) {
               console.error('Error fetching notifications:', error);
          }
     };

     const markAsRead = async (id) => {
          try {
               await fetch(`http://localhost:5000/api/notifications/mark-read/${id}`, {
                    method: 'POST'
               });
               setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, read: true } : n)
               );
               setUnreadCount(prev => prev - 1);
          } catch (error) {
               console.error('Error marking notification as read:', error);
          }
     };

     const markAllAsRead = async () => {
          try {
               await fetch('http://localhost:5000/api/notifications/mark-all-read', {
                    method: 'POST'
               });
               setNotifications(prev => prev.map(n => ({ ...n, read: true })));
               setUnreadCount(0);
          } catch (error) {
               console.error('Error marking all notifications as read:', error);
          }
     };

     const toggleProfile = () => {
          setIsProfileOpen(!isProfileOpen);
          setIsNotificationsOpen(false);
     };

     const toggleNotifications = () => {
          setIsNotificationsOpen(!isNotificationsOpen);
          setIsProfileOpen(false);
     };

     const handleSignOut = async () => {
          try {
               await signOut();
               navigate('/login');
          } catch (error) {
               console.error('Error signing out:', error);
          }
     };

     const getNotificationIcon = (type) => {
          switch (type) {
               case 'low_stock': return '⚠️';
               case 'purchase': return '📦';
               case 'sale': return '💰';
               case 'customer': return '👤';
               case 'user': return '👥';
               case 'supplier': return '🏭';
               case 'category': return '📁';
               case 'system': return '🖥️';
               default: return 'ℹ️';
          }
     };

     const formatTime = (dateString) => {
          const date = new Date(dateString);
          const now = new Date();
          const diffMs = now - date;
          const diffSec = Math.floor(diffMs / 1000);
          const diffMin = Math.floor(diffSec / 60);
          const diffHrs = Math.floor(diffMin / 60);
          const diffDays = Math.floor(diffHrs / 24);

          if (diffSec < 60) return 'Just now';
          if (diffMin < 60) return `${diffMin}m ago`;
          if (diffHrs < 24) return `${diffHrs}h ago`;
          if (diffDays < 7) return `${diffDays}d ago`;

          return date.toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric'
          });
     };

     return (
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
               <div className="h-full px-4 flex items-center justify-between">


                    {/* Search Bar */}
                    <div className="relative max-w-xs w-full hidden sm:block">
                         {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search size={18} className="text-gray-400 dark:text-gray-500" />
                         </div> */}
                         {/* <input
                              type="text"
                              placeholder="Search..."
                              className="w-full h-9 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                         /> */}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                         {/* Theme Toggle */}
                         <button
                              onClick={toggleTheme}
                              className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                         >
                              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                         </button>

                         {/* Notifications */}
                         <div className="relative">
                              <button
                                   className="relative p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                                   onClick={toggleNotifications}
                              >
                                   <Bell size={20} />
                                   {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                                             {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                   )}
                              </button>

                              {/* Notifications Dropdown */}
                              {isNotificationsOpen && (
                                   <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                             <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                                             {unreadCount > 0 && (
                                                  <button
                                                       onClick={markAllAsRead}
                                                       className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                                  >
                                                       Mark all as read
                                                  </button>
                                             )}
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                             {notifications.length > 0 ? (
                                                  notifications.map((notification) => (
                                                       <div
                                                            key={notification.id}
                                                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start gap-3 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                                 }`}
                                                       >
                                                            <span className="text-xl flex-shrink-0">
                                                                 {getNotificationIcon(notification.type)}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                 <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                                                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                      {formatTime(notification.created_at)}
                                                                 </p>
                                                            </div>
                                                            {!notification.read && (
                                                                 <button
                                                                      onClick={() => markAsRead(notification.id)}
                                                                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                                                 >
                                                                      <X size={16} />
                                                                 </button>
                                                            )}
                                                       </div>
                                                  ))
                                             ) : (
                                                  <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                                       No notifications
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Profile Dropdown */}
                         <div className="relative">
                              <button
                                   className="flex items-center gap-2 focus:outline-none"
                                   onClick={toggleProfile}
                              >
                                   <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium overflow-hidden">
                                        {userAvatar ? (
                                             <img
                                                  src={userAvatar}
                                                  alt={userName}
                                                  className="h-full w-full object-cover"
                                             />
                                        ) : (
                                             <User size={16} />
                                        )}
                                   </div>
                                   <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                                        {userName}
                                   </span>
                              </button>

                              {isProfileOpen && (
                                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                                        <a
                                             href="/profile"
                                             className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                             <User size={16} />
                                             Your Profile
                                        </a>
                                        <a
                                             href="/settings"
                                             className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                             <Settings size={16} />
                                             Settings
                                        </a>
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                        <button
                                             onClick={handleSignOut}
                                             className="block w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                             Sign out
                                        </button>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </header>
     );
};

export default Header;