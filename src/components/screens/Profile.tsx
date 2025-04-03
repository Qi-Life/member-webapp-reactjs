import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '~/services/AuthServices';
import NotificationList from '../pages/notifications/NotificationList';

const Profile = () => {
  const [profile, setProfile] = useState([]) as any;
  const [inforUser, setInforUser] = useState({ email: '', password: '' });

  const getDateProfile = async () => {
    try {
      const res = await getUser();
      setProfile(res.data);
    } catch (error) { }
  };

  useEffect(() => {
    getDateProfile();
  }, []);

  const handleChange = (e: any) => {
    setInforUser({ ...inforUser, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="space-y-4 md:space-y-6 mb-8">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-900">
            Name
          </label>
          <input
            onChange={(e) => handleChange(e)}
            type="name"
            name="name"
            id="name"
            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={profile?.name}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-900">
            Email
          </label>
          <input
            onChange={(e) => handleChange(e)}
            type="email"
            name="email"
            id="email"
            value={profile?.email}
            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            disabled
          />
        </div>
        <p>
          Do You Want to Downgrade Instead?{' '}
          <Link to="/member" className="text-[#7b52ab] hover:underline">
            Manage Subscriptions
          </Link>
        </p>
      </div>
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <NotificationList />
    </>
  );
};

export default Profile;
