import { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  const setSession = (sessionId) => {
    setSessionId(sessionId);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
