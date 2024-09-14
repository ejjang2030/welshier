import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";

export const getUserByUid = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  return userSnapshot.data();
};

export const getUserByUserId = async (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = query(collection(db, "users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(res => {
        resolve(res.data());
      });
    } catch (error: any) {
      reject(error);
    }
  });
};

interface UserData {
  name: string;
  userId: string;
  introduction: string;
  imageUrl: string;
}

export const inputUserData = (uid: string, userData: UserData) => {};
