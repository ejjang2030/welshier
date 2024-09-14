import { BsHeart as HeartIconOutline } from "react-icons/bs";
import { BsChat as ChatIcon } from "react-icons/bs";
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs";
import { MdOutlineInput as RepostIcon } from "react-icons/md";
import { BsSend as SendIcon } from "react-icons/bs";
import AuthContext from "context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { PostProps } from "pages/home";
import { getUserByUid, getUserIdByUid } from "utils/UserUtils";
import "./Post.module.scss";

const PostBox = ({ post }: { post: PostProps }) => {
  const [userId, setUserId] = useState<string>("");
  const [userImageUrl, setUserImageUrl] = useState<string>("");
  useEffect(() => {
    getUserIdByUid(post.uid, (userId: string) => {
      setUserId(userId);
    });
    getUserByUid(post.uid, (uData) => {
      setUserImageUrl(uData.imageUrl);
    });
  }, []);

  return (
    <div className="post-box">
      <div className="image">
        <img className="img" src={userImageUrl} />
      </div>
      <div className="content">
        <div className="profile-and-menu">
          <div className="profile">
            {userId}
            <span>2주</span>
          </div>
          <div className="menu">
            <ThreeDotsIcon className="icon" />
          </div>
        </div>
        <div className="body">{`${post.content}`}</div>
        <div className="post-footer">
          <div className="icons">
            <div className="likes-btn">
              <HeartIconOutline className="icon" />
              <span>{post.likeCount}</span>
            </div>
            <div className="comments-btn">
              <ChatIcon className="icon" />
              <span>{post.comments?.length || 0}</span>
            </div>
            <div className="reposts-btn">
              <RepostIcon className="icon" />
              <span>1</span>
            </div>
            <div className="send-btn">
              <SendIcon className="icon" />
              <span>1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
