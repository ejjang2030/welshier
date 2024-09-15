import {BsHeart as HeartIconOutline} from "react-icons/bs";
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
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "firebaseApp";
import {toast} from "react-toastify";

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

  return (
    <div className='post-box'>
      <div className='image'>
        <img
          className='img'
          src={userImageUrl}
        />
      </div>
      <div className='content'>
        <div className='profile-and-menu'>
          <div className='profile'>
            {userId}
            <span>2주</span>
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
            <div className='likes-btn'>
              <HeartIconOutline className='icon' />
              <span>{post.likeCount}</span>
            </div>
            <div className='comments-btn'>
              <ChatIcon className='icon' />
              <span>{post.comments?.length || 0}</span>
            </div>
            <div className='reposts-btn'>
              <RepostIcon className='icon' />
              <span>1</span>
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
