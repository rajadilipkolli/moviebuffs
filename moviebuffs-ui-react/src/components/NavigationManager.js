import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { history } from '../history';

export const NavigationManager = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    history.setNavigate(navigate);
  }, [navigate]);
  
  return null;
};
