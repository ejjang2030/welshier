import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";

export const getUserByUid = async (
  uid: string,
  cb: (userData: UserData) => void
) => {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((snapshot) => {
    const uData = snapshot.data() as UserData;
    cb(uData);
  });
};

export const getUserByUserId = async (userId: string) => {
  let uData;
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((res) => {
    uData = res.data();
  });
  return uData;
};

export const getUidByUserId = (userId: string, cb: (uid: string) => void) => {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  getDocs(q).then((querySnapshot) => {
    const uid = querySnapshot.docs.map((doc) => doc.id)[0];
    cb(uid);
  });
};

export const getUserIdByUid = async (
  uid: string,
  cb: (userId: string) => void
) => {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((querySnapshot) => {
    const userId = querySnapshot.data()?.userId;
    cb(userId);
  });
};

export const checkDuplicatedUserId = async (userId: string) => {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot && snapshot.docs.length > 0;
};

interface UserData {
  name: string;
  userId: string;
  introduction: string;
  imageUrl: string;
}

export const inputUserData = (uid: string, userData: UserData) => {};
