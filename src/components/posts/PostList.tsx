import {Link} from "react-router-dom";
import {FaUserCircle, FaRegComment} from "react-icons/fa";
import {AiFillHeart} from "react-icons/ai";
import {PostProps} from "pages/home";
interface PostListProps {
  posts: PostProps[];
  handleDelete: () => void;
  handleEdit: () => void;
}

const PostList = ({posts, handleDelete, handleEdit}: PostListProps) => {
  return (
    <div className='post'>
      {posts?.map(post => (
        <div
          className='post__box'
          key={post?.id}>
          <Link to={`/posts/${post?.id}`}>
            <div className='post__box-profile'>
              <div className='post__box-profile-flex'>
                {post?.profileUrl ? (
                  <img
                    src={post?.profileUrl}
                    alt='profile'
                    className='post__box-profile-image'
                  />
                ) : (
                  <FaUserCircle className='post__box-profile-icon' />
                )}
                <div className='post__email'>{post?.email}</div>
                <div className='post__createdAt'>{post?.createdAt}</div>
              </div>
            </div>
            <div className='post__box-content'>{post?.content}</div>
          </Link>
          <div className='post__box-footer'>
            <button
              type='button'
              className='button post__delete'
              onClick={handleDelete}>
              삭제
            </button>
            <button
              type='button'
              className='button post__edit'
              onClick={handleEdit}>
              <Link to={`/posts/edit/${post?.id}`}>수정</Link>
            </button>
            <button
              type='button'
              className='button post__likes'
              onClick={handleDelete}>
              <AiFillHeart />
              {post?.likeCount || 0}
            </button>
            <button
              type='button'
              className='button post__comments'
              onClick={handleEdit}>
              <FaRegComment />
              {post?.comments?.length || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
