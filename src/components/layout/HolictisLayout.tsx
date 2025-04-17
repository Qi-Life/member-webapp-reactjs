import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { isLogined } from '~/helpers/token';

const HolictisLayout = () => {
  const navigate = useNavigate();
  
    useEffect(() => {
      const isLoggedIn = isLogined()// Example check for auth token
      if (!isLoggedIn) {
        return navigate('/login');
      }
    }, [navigate]);
  
    return (
      <div style={{ fontFamily: 'League Spartan, sans-serif', fontWeight: 300, marginBottom: '-100px', backgroundColor: '#ffffff' }}>
        <div className='absolute z-20 right-0 top-0 p-5  text-2xl md:text-3xl text-[#409f83] hover:opacity-0.8 cursor-pointer' onClick={()=> navigate('/')}>X</div>
        <Outlet />
      </div>
    );
}

export default HolictisLayout
