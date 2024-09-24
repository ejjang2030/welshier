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
import {Follower, Post, UserData} from "types";

export interface AlertActivityItemProps {
  key: number;
  postId: string;
  message: string;
  isRead: boolean;
  onClick: any;
}

const LikedActivityItem = ({
  key,
  postId,
  message,
  isRead,
  onClick,
}: AlertActivityItemProps) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  return (
    <div
      className='followed-notification-item'
      key={`followed-notification-item_${user?.userId}_${key}`}>
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
      <div className='followed-notification-item__image'>
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/welshier.appspot.com/o/profiles%2Fdefault%2Fdefault-profile?alt=media&token=cc70557c-d6c7-4173-9e68-26f8b8fb2cc5`}
          alt=''
          onClick={() => {
            onClick();
            navigate(`/posts/${postId}`);
          }}
        />
      </div>
      <div className='followed-notification-item__profile'>
        <div
          className='followed-notification-item__profile-userId'
          onClick={() => {
            onClick();
            navigate(`/posts/${postId}`);
          }}>
          {user?.userId}
        </div>
        <div
          className='followed-notification-item__profile-followers'
          onClick={() => {
            onClick();
            navigate(`/posts/${postId}`);
          }}>
          <div className='followers'>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default LikedActivityItem;
