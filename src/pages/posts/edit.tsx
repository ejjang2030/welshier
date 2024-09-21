import PostInput from "components/posts/PostInput";
import AuthContext from "context/AuthContext";
import {doc, getDoc} from "firebase/firestore";
import {db} from "firebaseApp";
import {useCallback, useContext, useEffect, useState} from "react";
import {AiOutlineClose as CloseIcon} from "react-icons/ai";
import {useNavigate, useParams} from "react-router-dom";
import {Post} from "types";

const PostEditPage = () => {
  const {user} = useContext(AuthContext);
  const {id: postId} = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);

  const getPost = useCallback(async () => {
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      setPost({...(postSnapshot.data() as Post), id: postSnapshot.id});
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [getPost, postId]);

  useEffect(() => {
    console.log(post);
  }, [post]);

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
        <PostInput
          isEdit
          user={user}
          defaultPost={post}
        />
      </div>
    </div>
  );
};

export default PostEditPage;
