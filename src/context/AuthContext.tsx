import {createContext, ReactNode, useState, useEffect} from "react";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import {app} from "firebaseApp";
import {getUserByUid} from "utils/UserUtils";

const AuthContext = createContext({
  user: null as User | null,
  isNotSetProfile: false,
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isNotSetProfile, setIsNotSetProfile] = useState<boolean>(true);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        const userData = getUserByUid(user.uid);
        console.log(userData);
        if (!!userData) {
          setCurrentUser(user);
          setIsNotSetProfile(false);
        } else {
          setCurrentUser(null);
          setIsNotSetProfile(true);
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{user: currentUser, isNotSetProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
