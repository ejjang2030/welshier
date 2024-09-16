import {Follower, UserData} from "types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {getRandomElements} from "./RandomUtils";

export const getUserDataByUid = async (
  uid: string,
  cb: (userData: UserData) => void
) => {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then(snapshot => {
    const data = snapshot.data();
    if (data) {
      const uData = {
        uid: data.uid,
        email: data.email,
        userId: data.userId,
        name: data.name,
        imageUrl: data.imageUrl,
        introduction: data.introduction,
        isPrivate: data.isPrivate,
      };
      cb(uData);
    } else {
      throw new Error("사용자 정보가 없습니다.");
    }
  });
};

export const getUserDataByUserId = async (userId: string) => {
  let uData;
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(res => {
    uData = res.data();
  });
  return uData;
};

export const getUidByUserId = (userId: string, cb: (uid: string) => void) => {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  getDocs(q).then(querySnapshot => {
    const uid = querySnapshot.docs.map(doc => doc.id)[0];
    cb(uid);
  });
};

export const getUserIdByUid = async (
  uid: string,
  cb: (userId: string) => void
) => {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then(querySnapshot => {
    const userId = querySnapshot.data()?.userId;
    cb(userId);
  });
};

export const checkDuplicatedUserId = async (userId: string) => {
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot && snapshot.docs.length > 0;
};

export const inputUserData = (uid: string, userData: UserData) => {};

export const getTwoUserImageUrlsFromFollowers = async (
  followers: Follower[],
  cb: (imageUrls: string[]) => void
) => {
  const randomFollowers = getRandomElements<Follower>(followers, 2);
  if (randomFollowers) {
    const q = query(
      collection(db, "users"),
      where("uid", "in", [...randomFollowers!.map(follower => follower.id)])
    );
    const snapshot = await getDocs(q);
    cb(snapshot.docs.map(doc => doc.data().imageUrl));
  }
};
