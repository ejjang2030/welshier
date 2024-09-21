import {Post} from "types";
import PostBox from "./PostBox";
interface PostList {
  name: string;
  posts: Post[] | null;
}

const PostList = ({name, posts}: PostList) => {
  return (
    <div className='post'>
      {posts?.map(post => (
        <PostBox
          key={`${name}_${post.id}`}
          post={post}
        />
      ))}
    </div>
  );
};

export default PostList;
