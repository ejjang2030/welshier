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
  let uData;
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(res => {
    uData = res.data();
  })
  return uData;
};

export const getUidByUserId = async (userId: string) => {
  const q = query(collection(db, 'users'), where('userId', "==", userId));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.docs[0])
  // return querySnapshot.docs[0]?.data().id;
}

export const getUserIdByUid = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  console.log('userSnapshot :', userSnapshot);
  return userSnapshot.data()?.userId;
}

export const checkDuplicatedUserId = async (userId: string) => {
  const q = query(collection(db, 'users'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot && snapshot.docs.length > 0;
}

interface UserData {
  name: string;
  userId: string;
  introduction: string;
  imageUrl: string;
}

export const inputUserData = (uid: string, userData: UserData) => {};
