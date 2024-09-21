import {useContext, useEffect, useState} from "react";
import PostInput from "components/posts/PostInput";
import {GiSittingDog} from "react-icons/gi";
import {HiMenuAlt4} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import PostList from "components/posts/PostList";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {Post} from "types";

const HomePage = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[] | undefined>();

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const postsQuery = query(
      postsRef,
      where("parentPostId", "==", "root"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(postsQuery, snapshot => {
      let dataObj = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc?.id,
      }));
      setPosts(dataObj as Post[]);
    });
  }, []);

  return (
    <div className='home'>
      <div className='home__title'>
        <div className='home__title-left'></div>
        <div className='home__title-logo'>
          <GiSittingDog className='home__title-logo-icon' />
        </div>
        <div className='home__title-right'>
          <HiMenuAlt4
            className='home__title-right-icon'
            onClick={() => navigate("/posts")}
          />
        </div>
      </div>
      <PostInput user={user} />
      {posts?.length ? (
        <PostList
          name='home'
          posts={posts}
        />
      ) : (
        <div className='home__no-contents'>게시글이 없습니다.</div>
      )}
    </div>
  );
};

export default HomePage;
