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
import {GoHeartFill as HeartIconFill} from "react-icons/go";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Follower, Post, UserData} from "types";

export interface LikedActivityItemProps {
  key: number;
  uid: string;
  postId: string;
  isRead: boolean;
  onClick: any;
}

const LikedActivityItem = ({
  key,
  uid,
  postId,
  isRead,
  onClick,
}: LikedActivityItemProps) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [postContent, setPostContent] = useState<string>("");

  useEffect(() => {
    if (uid) {
      const userDataRef = doc(db, "users", uid);
      onSnapshot(userDataRef, doc => {
        setUserData({...(doc.data() as UserData), uid: doc.id});
      });
    }
  }, [uid]);

  useEffect(() => {
    if (postId) {
      const postRef = doc(db, "posts", postId);
      onSnapshot(postRef, doc => {
        setPostContent((doc.data() as Post).content);
      });
    }
  }, [postId]);

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
        <HeartIconFill
          className='icon'
          style={{
            width: "10px",
            height: "10px",
            padding: "4px",
            color: "white",
            backgroundColor: "#ff0c88",
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
        <div
          className='followed-notification-item__profile-followers'
          onClick={() => {
            onClick();
            navigate(`/posts/${postId}`);
          }}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "297px",
              fontSize: "16px",
              color: "#847f7f",
            }}>
            {postContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedActivityItem;
