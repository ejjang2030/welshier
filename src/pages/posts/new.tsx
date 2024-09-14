import PostInput from "components/posts/PostInput";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const PostNewPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="post-new__appbar">
        <div className="post-new__appbar-box-left">
          <CloseIcon
            className="post-new__appbar-left"
            onClick={() => navigate(-1)}
          />
          <span>새로운 글</span>
        </div>
      </div>
      <div>
        <PostInput isEdit />
      </div>
    </div>
  );
};

export default PostNewPage;
