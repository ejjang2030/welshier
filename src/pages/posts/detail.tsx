import PostBox from "components/posts/PostBox";
import PostInput from "components/posts/PostInput";
import PostList from "components/posts/PostList";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  documentId,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {useCallback, useContext, useEffect, useState} from "react";
import {AiOutlineArrowLeft as GoBackIcon} from "react-icons/ai";
import {useNavigate, useParams} from "react-router-dom";
import {Post} from "types";

const PostDetailPage = () => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const {id: postId} = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [commentPosts, setCommentPosts] = useState<Post[]>([]);

  const getPost = useCallback(async () => {
    setPost(null);
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      setPost({...(postSnapshot.data() as Post), id: postSnapshot.id});
    }
  }, [postId]);

  useEffect(() => {
    if (postId) getPost();
  }, [postId]);

  useEffect(() => {
    setCommentPosts([]);
    if (post && post.comments) {
      const postsRef = collection(db, "posts");
      const postsQuery = query(
        postsRef,
        where(documentId(), "in", post.comments),
        orderBy("createdAt", "asc")
      );
      onSnapshot(postsQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setCommentPosts(dataObj as Post[]);
      });
    }
  }, [post]);

  return (
    <div>
      <div className='post-new__appbar'>
        <div className='post-new__appbar-box-left'>
          <GoBackIcon
            className='post-new__appbar-left'
            onClick={() => navigate(-1)}
          />
          <span>답글</span>
        </div>
      </div>
      <div>
        {post && (
          <>
            <PostBox post={post} />
            <div className='horizontal-divider'> </div>
            {commentPosts && <PostList posts={commentPosts} />}
            <PostInput
              isEdit
              user={user}
              defaultPost={null}
              parentPostId={post.id}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
