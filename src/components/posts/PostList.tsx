import {Post} from "types";
import PostBox from "./PostBox";
interface PostList {
  posts: Post[] | null;
}

const PostList = ({posts}: PostList) => {
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
