import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {
  BsHeart as HeartIconOutline,
  BsHeartFill as HeartIconFill,
} from "react-icons/bs";
import {BsChat as ChatIcon} from "react-icons/bs";
import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getTimeElapsed} from "utils/TimeUtils";
import {getUserDataByUid, getUserIdByUid} from "utils/UserUtils";
import {BsSend as SendIcon} from "react-icons/bs";
import {Post} from "types";

export interface PostBoxActivityItemProps {
  key: number;
  postId: string;
  isRead: boolean;
  onClick: any;
}

const PostBoxActivityItem = ({
  key,
  postId,
  isRead,
  onClick,
}: PostBoxActivityItemProps) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [userId, setUserId] = useState<string>("");
  const [userImageUrl, setUserImageUrl] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);

  const getPost = useCallback(async () => {
    setPost(null);
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      setPost({...(postSnapshot.data() as Post), id: postSnapshot.id});
    }
  }, [postId]);

  const handleToggleLike = async (e: any) => {
    e.preventDefault();
    if (post) {
      const likeRef = doc(db, "posts", post.id);

      if (user?.uid && post?.likes?.includes(user!.uid)) {
        // 취소
        await updateDoc(likeRef, {
          likes: arrayRemove(user.uid),
          likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
        });
      } else {
        // 좋아요를 누른다.
        if (user?.uid) {
          await updateDoc(likeRef, {
            likes: arrayUnion(user.uid),
            likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (postId) getPost();
  }, [getPost, postId]);

  useEffect(() => {
    if (post) {
      getUserIdByUid(post.uid, (userId: string) => {
        setUserId(userId);
      });
      getUserDataByUid(post.uid, uData => {
        if (uData) {
          setUserImageUrl(uData.imageUrl);
        }
      });
    }
  }, [post]);

  return (
    <div className='post-box'>
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
      <div className='image'>
        <img
          className='img'
          src={userImageUrl}
          alt=''
          style={{cursor: "pointer"}}
          onClick={(e: any) => {
            e.preventDefault();
            onClick();
            navigate(`/profile/@${userId}`);
          }}
        />
      </div>
      <div className='content'>
        <div className='profile-and-menu'>
          <div
            className='profile'
            style={{cursor: "pointer"}}
            onClick={(e: any) => {
              e.preventDefault();
              onClick();
              navigate(`/profile/@${userId}`);
            }}>
            {userId}
            <span>{!!post && getTimeElapsed(new Date(post!.createdAt))}</span>
          </div>
          <div className='menu'>{/* <ThreeDotsIcon className='icon' /> */}</div>
        </div>
        <div className='body'>
          <p>{post?.content}</p>
          <div className='hashtag-list'>
            {post?.hashtags?.map((tag, index) => (
              <span
                key={index}
                className='item'>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className='post-footer'>
          <div className='icons'>
            <div
              className='likes-btn'
              onClick={handleToggleLike}>
              {user && post?.likes?.includes(user!.uid) ? (
                <HeartIconFill className='icon' />
              ) : (
                <HeartIconOutline className='icon' />
              )}
              <span>{post?.likeCount || 0}</span>
            </div>
            <div
              className='comments-btn'
              onClick={(e: any) => {
                e.preventDefault();
                onClick();
                navigate(`/posts/${post?.id}`);
              }}>
              <ChatIcon className='icon' />
              <span>{post?.comments?.length || 0}</span>
            </div>
            <div className='send-btn'>
              <SendIcon className='icon' />
              <span>1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBoxActivityItem;
