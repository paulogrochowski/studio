'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useIsCustomer() {
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const checkCustomerCookie = () => {
        const customerCookie = Cookies.get('auth-token');
        setIsCustomer(!!customerCookie);
    };

    checkCustomerCookie();
    
    const interval = setInterval(checkCustomerCookie, 2000); 

    return () => {
      clearInterval(interval);
    };
  }, []);

  return isCustomer;
}
