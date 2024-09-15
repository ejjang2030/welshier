import {
  BsHeart as HeartIconOutline,
  BsHeartFill as HeartIconFill,
} from "react-icons/bs";
import {BsChat as ChatIcon} from "react-icons/bs";
import {BsThreeDots as ThreeDotsIcon} from "react-icons/bs";
import {MdOutlineInput as RepostIcon} from "react-icons/md";
import {FiDelete as DeleteIcon} from "react-icons/fi";
import {MdOutlineModeEditOutline as EditIcon} from "react-icons/md";
import {BsSend as SendIcon} from "react-icons/bs";
import AuthContext from "context/AuthContext";
import {useContext, useState, useEffect} from "react";
import {PostProps} from "pages/home";
import {getUserByUid, getUserIdByUid} from "utils/UserUtils";
import "./Post.module.scss";
import {useNavigate} from "react-router-dom";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {toast} from "react-toastify";
import {getTimeElapsed} from "utils/TimeUtils";

const PostBox = ({post}: {post: PostProps}) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [userId, setUserId] = useState<string>("");
  const [userImageUrl, setUserImageUrl] = useState<string>("");
  useEffect(() => {
    getUserIdByUid(post.uid, (userId: string) => {
      setUserId(userId);
    });
    getUserByUid(post.uid, uData => {
      setUserImageUrl(uData.imageUrl);
    });
  }, []);

  const handleDeletePost = async (e: any) => {
    e.preventDefault();
    await deleteDoc(doc(db, "posts", post.id));
    toast.success("게시글을 삭제했습니다.");
  };

  const handleToggleLike = async (e: any) => {
    const likeRef = doc(db, "posts", post.id);

    if (user?.uid && post.likes?.includes(user!.uid)) {
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
  };

  return (
    <div className='post-box'>
      <div className='image'>
        <img
          className='img'
          src={userImageUrl}
          alt=''
        />
      </div>
      <div className='content'>
        <div className='profile-and-menu'>
          <div className='profile'>
            {userId}
            <span>{getTimeElapsed(new Date(post?.createdAt))}</span>
          </div>
          <div className='menu'>
            {user?.uid === post?.uid && (
              <>
                <DeleteIcon
                  className='icon'
                  onClick={handleDeletePost}
                />
                <EditIcon
                  className='icon'
                  onClick={() => navigate(`/posts/edit/${post.id}`)}
                />
              </>
            )}
            <ThreeDotsIcon className='icon' />
          </div>
        </div>
        <div className='body'>
          <p>{post.content}</p>
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
              {user && post.likes?.includes(user!.uid) ? (
                <HeartIconFill className='icon' />
              ) : (
                <HeartIconOutline className='icon' />
              )}
              <span>{post.likeCount || 0}</span>
            </div>
            <div className='comments-btn'>
              <ChatIcon className='icon' />
              <span>{post.comments?.length || 0}</span>
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

export default PostBox;
