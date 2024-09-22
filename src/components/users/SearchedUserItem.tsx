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
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Follower, UserData} from "types";
import {getTwoUserImageUrlsFromFollowers} from "utils/UserUtils";

export interface SearchedUserItemProps {
  key: string;
  userData: UserData;
}

const SearchedUserItem = ({key, userData}: SearchedUserItemProps) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followersImageUrls, setFollowersImageUrls] = useState<string[]>([]);

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

  useEffect(() => {
    if (followers) {
      getTwoUserImageUrlsFromFollowers(followers, (imageUrls: string[]) => {
        setFollowersImageUrls(imageUrls);
      });
    }
  }, [followers]);

  return (
    <div
      className='searched-user-item'
      key={`${userData.userId}_${key}`}>
      <div className='searched-user-item__image'>
        <img
          src={userData.imageUrl}
          alt=''
          onClick={() => navigate(`/profile/@${userData.userId}`)}
        />
      </div>
      <div className='searched-user-item__profile'>
        <div
          className='searched-user-item__profile-userId'
          onClick={() => navigate(`/profile/@${userData.userId}`)}>
          {userData.userId}
        </div>
        <div className='searched-user-item__profile-introduction'>
          {userData.introduction}
        </div>
        <div className='searched-user-item__profile-followers'>
          {followers.length > 0 && followersImageUrls.length !== 0 && (
            <div className='images'>
              {followersImageUrls.map((imageUrl, index) => (
                <img
                  key={`img${index + 1}`}
                  className={`img${index + 1}`}
                  src={imageUrl}
                  alt=''
                />
              ))}
            </div>
          )}
          <div
            className={
              followersImageUrls.length > 1
                ? "followers"
                : followersImageUrls.length === 1
                ? "follower"
                : "no-follower"
            }>
            팔로워 {followers.length || 0}명
          </div>
        </div>
      </div>
      <div className='searched-user-item__follow-btn'>
        {user?.uid !== userData.uid && (
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

export default SearchedUserItem;
