import PostInput from "components/posts/PostInput";
import AuthContext from "context/AuthContext";
import {useContext} from "react";
import {AiOutlineClose as CloseIcon} from "react-icons/ai";
import {useNavigate} from "react-router-dom";

const PostNewPage = () => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <div className='post-new__appbar'>
        <div className='post-new__appbar-box-left'>
          <CloseIcon
            className='post-new__appbar-left'
            onClick={() => navigate(-1)}
          />
          <span>새로운 글</span>
        </div>
      </div>
      <div className='post-new__body'>
        <PostInput
          isEdit
          user={user}
        />
      </div>
    </div>
  );
};

export default PostNewPage;
