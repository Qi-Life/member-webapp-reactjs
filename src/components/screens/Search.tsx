import React, { useState, useEffect, useCallback } from 'react';

import Album from '../pages/search/Album';
import Rife from '../pages/search/Rife';
import SearchMenu from '../pages/search/SearchMenu';

const SearchScreen = () => {
  return (
    <>
        <SearchMenu />
        <Rife />            
        <Album />
    </>
  );
};

export default SearchScreen;
