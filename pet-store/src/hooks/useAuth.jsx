import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'ADMIN');
    setIsUser(role === 'USER');
    setLoading(false);
  }, []);

  return { isAdmin, isUser, loading };
};

export default useAuth;