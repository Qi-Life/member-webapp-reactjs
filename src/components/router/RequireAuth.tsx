import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../helpers/token';
import { configApp } from '../../configs/config';

export default function RequireAuth(props: any) {
  const { children } = props;
  return getToken(configApp.tokenKey) ? children : <Navigate to="/starter-frequencies" />;
}
