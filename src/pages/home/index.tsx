import {useContext, useEffect, useState} from "react";
import PostInput from "components/posts/PostInput";
import {GiSittingDog} from "react-icons/gi";
import {HiMenuAlt4} from "react-icons/hi";
import {Link, useNavigate} from "react-router-dom";
import PostList from "components/posts/PostList";
import AuthContext from "context/AuthContext";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "firebaseApp";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  userId?: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashtags?: string[];
}

interface User {
  uid: string;
}

interface HomeProps {
  user: User;
}

const HomePage = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[] | undefined>();

  useEffect(() => {
    if (user) {
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      onSnapshot(postsQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
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
      <PostInput />
      {posts?.length ? <PostList posts={posts} /> : <>게시글이 없습니다.</>}
    </div>
  );
};

export default HomePage;
