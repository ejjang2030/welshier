import {createContext, ReactNode, useState, useEffect} from "react";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import {app} from "firebaseApp";
import {getUserDataByUid} from "utils/UserUtils";
import {UserData} from "types/users";

const AuthContext = createContext({
  user: null as UserData | null,
  isNotSetProfile: false,
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isNotSetProfile, setIsNotSetProfile] = useState<boolean>(true);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        getUserDataByUid(user.uid, uData => {
          if (!!uData) {
            const userData: UserData | null = {
              uid: user!.uid!,
              email: user!.email!,
              userId: uData.userId,
              name: uData.name,
              imageUrl: uData.imageUrl,
              introduction: uData.introduction,
              isPrivate: uData.isPrivate,
            };
            setCurrentUser(userData);
            setIsNotSetProfile(false);
          } else {
            setCurrentUser(null);
            setIsNotSetProfile(true);
          }
        });
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
