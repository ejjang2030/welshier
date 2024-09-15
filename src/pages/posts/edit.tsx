import PostInput from "components/posts/PostInput";
import {AiOutlineClose as CloseIcon} from "react-icons/ai";
import {useNavigate} from "react-router-dom";

const PostEditPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className='post-new__appbar'>
        <div className='post-new__appbar-box-left'>
          <CloseIcon
            className='post-new__appbar-left'
            onClick={() => navigate(-1)}
          />
          <span>게시글 수정</span>
        </div>
      </div>
      <div>
        <PostInput isEdit />
      </div>
    </div>
  );
};

export default PostEditPage;
