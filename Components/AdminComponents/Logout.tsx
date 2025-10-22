
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import axios from 'axios';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/users/logout');

      const data = await res.data;

      alert(res.data.message || 'Logout successful');
      router.push('/auth/login'); 
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Logout error:', error.message);
        }
      alert('Something went wrong');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
