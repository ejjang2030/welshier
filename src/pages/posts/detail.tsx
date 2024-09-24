import PostBox from "components/posts/PostBox";
import PostInput from "components/posts/PostInput";
import PostList from "components/posts/PostList";
import AuthContext from "context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {useCallback, useContext, useEffect, useState} from "react";
import {AiOutlineArrowLeft as GoBackIcon} from "react-icons/ai";
import {useNavigate, useParams} from "react-router-dom";
import {Post} from "types";
import {ActivityData} from "types/notifications";

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

  // 조회수 업데이트
  const updateViewCount = useCallback(async () => {
    if (post) {
      // 해당 게시물의 조회수가 100회 단위로 일어났을 경우 조회수 알람을 보내는 로직
      if (post.viewCount! !== 0 && post.viewCount! % 100 === 0) {
        const activityRef = doc(db, "activities", post!.uid);
        const collectionRef = collection(activityRef, "activities");
        const activityData: ActivityData = {
          activityType: "alert",
          postId: post.id,
          isRead: false,
          createdAt: new Date().toLocaleDateString("en", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
          message: `해당 게시물의 조회수가 ${post.viewCount}회가 넘었습니다!`,
        };
        await addDoc(collectionRef, activityData);
      }

      // 조회수를 업데이트 하는 로직
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        viewCount: post.viewCount! + 1,
      });
    }
  }, [post]);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  useEffect(() => {
    setCommentPosts([]);
    if (post) {
      updateViewCount();
      if (post.comments && post.comments.length > 0) {
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
            {commentPosts && (
              <PostList
                name='detail'
                posts={commentPosts}
              />
            )}
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
