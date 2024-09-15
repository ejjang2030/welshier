import {Link} from "react-router-dom";
import {FaUserCircle, FaRegComment} from "react-icons/fa";
import {AiFillHeart} from "react-icons/ai";
import {PostProps} from "pages/home";
import PostBox from "./PostBox";
interface PostListProps {
  posts: PostProps[] | undefined;
}

const PostList = ({posts}: PostListProps) => {
  return (
    <div className='post'>
      {posts?.map(post => (
        <PostBox
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
};

export default PostList;
