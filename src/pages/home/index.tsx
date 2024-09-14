import PostInput from "components/posts/PostInput";
import { GiSittingDog } from "react-icons/gi";
import {HiMenuAlt4} from "react-icons/hi";
import {Link} from "react-router-dom";
import PostList from "components/posts/PostList";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

interface User {
  uid: string;
}

interface HomeProps {
  user: User;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "2",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!2",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "3",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!3",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "4",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "5",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "6",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "7",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "8",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
  {
    id: "9",
    email: "ejjang2030@gmail.com",
    content: "한번 만들어보겠습니다!4",
    createdAt: "2024-09-07",
    uid: "awerwerwe121213",
  },
];

const HomePage = () => {
  const handleFileUpload = () => {};
  const handleDelete = () => {};
  const handleEdit = () => {};

  return (
    <div className='home'>
      <div className='home__title'>
        <div className='home__title-left'></div>
        <div className='home__title-logo'>
          <GiSittingDog className='home__title-logo-icon' />
        </div>
        <div className='home__title-right'>
          <Link to={`/posts`}>
            <HiMenuAlt4 className='home__title-right-icon' />
          </Link>
        </div>
      </div>
      <PostInput />
      <PostList
        posts={posts}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default HomePage;
