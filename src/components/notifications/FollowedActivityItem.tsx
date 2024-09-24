import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {GoPersonFill as PersonIconFill} from "react-icons/go";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Follower, UserData} from "types";

export interface FollowedActivityItemProps {
  key: number;
  uid: string;
  isRead: boolean;
  onClick: any;
}

const FollowedActivityItem = ({
  key,
  uid,
  isRead,
  onClick,
}: FollowedActivityItemProps) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);

  const handleCancelFollow = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (user && user.uid && userData) {
        const followingsRef = doc(db, "followings", user.uid);
        await updateDoc(followingsRef, {
          users: arrayRemove({id: userData.uid}),
        });
        const followersRef = doc(db, "followers", userData.uid);
        await updateDoc(followersRef, {
          users: arrayRemove({id: user.uid}),
        });
      }
    },
    [userData, user]
  );

  const handleFollow = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (user && user.uid && userData) {
        // 현재 로그인된 사용자가 해당 프로필의 사용자를 팔로우하는 로직
        const followingsRef = doc(db, "followings", user.uid);
        await setDoc(
          followingsRef,
          {users: arrayUnion({id: userData.uid})},
          {merge: true}
        );
        // 해당 프로필의 사용자가 현재 로그인된 사용자를 팔로잉 당하는 로직
        const followersRef = doc(db, "followers", userData.uid);
        await setDoc(
          followersRef,
          {users: arrayUnion({id: user.uid})},
          {merge: true}
        );
      }
    },
    [userData, user]
  );

  const isFollow = useMemo(() => {
    return user && followers.map(follower => follower.id).includes(user.uid);
  }, [user, followers]);

  useEffect(() => {
    if (uid) {
      const userDataRef = doc(db, "users", uid);
      onSnapshot(userDataRef, doc => {
        setUserData({...(doc.data() as UserData), uid: doc.id});
      });
    }
  }, [uid]);

  useEffect(() => {
    if (userData) {
      const followersRef = doc(db, "followers", userData.uid);
      onSnapshot(followersRef, doc => {
        setFollowers([]);
        doc?.data()?.users?.map((user: Follower) => {
          setFollowers(prev => (prev ? [...prev, {id: user.id}] : []));
        });
      });
    }
  }, [userData]);

  return (
    <div
      className='followed-notification-item'
      key={`followed-notification-item_${userData?.userId}_${key}`}>
      {!isRead && (
        <div
          style={{
            backgroundColor: "red",
            width: "5px",
            height: "5px",
            borderRadius: "999px",
            color: "red",
          }}></div>
      )}
      <div
        className='followed-notification-item__image'
        style={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
        <img
          src={userData?.imageUrl}
          alt=''
          onClick={() => {
            onClick();
            navigate(`/profile/@${userData?.userId}`);
          }}
        />
        <PersonIconFill
          className='icon'
          style={{
            width: "10px",
            height: "10px",
            padding: "4px",
            color: "white",
            backgroundColor: "#462979",
            borderRadius: "999px",
            border: "1px solid white",
            transform: "translateX(-15px)",
          }}
        />
      </div>
      <div
        className='followed-notification-item__profile'
        style={{transform: "translateX(-15px)"}}>
        <div
          className='followed-notification-item__profile-userId'
          onClick={() => {
            onClick();
            navigate(`/profile/@${userData?.userId}`);
          }}>
          {userData?.userId}
        </div>
        <div className='followed-notification-item__profile-followers'>
          <div style={{fontSize: "16px", color: "#847f7f"}}>나를 팔로우함</div>
        </div>
      </div>
      <div className='followed-notification-item__follow-btn'>
        {user?.uid !== userData?.uid && (
          <>
            {isFollow ? (
              <button
                className='followed-btn'
                onClick={handleCancelFollow}>
                팔로잉
              </button>
            ) : (
              <button
                className='follow-btn'
                onClick={handleFollow}>
                팔로우
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FollowedActivityItem;
