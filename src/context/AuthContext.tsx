import {createContext, ReactNode, useState, useEffect} from "react";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import {app} from "firebaseApp";

const AuthContext = createContext({user: null as User | null});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{user: currentUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
