import {useRef, useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {toast} from "react-toastify";
import {Post, UserData} from "types";

interface PostInputProps {
  user: UserData | null;
  isEdit?: boolean;
  defaultPost?: Post | null;
  parentPostId?: string | null;
}

const PostInput = ({
  user,
  defaultPost = null,
  isEdit = false,
  parentPostId = null,
}: PostInputProps) => {
  const navigate = useNavigate();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState<string>("");
  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyUp = (e: any) => {
    if (
      (e.keyCode === 32 || e.keyCode === 13) &&
      e.target.value.trim() !== ""
    ) {
      // 태그 생성
      if (hashtags && !hashtags.includes(e.target.value?.trim())) {
        setHashtags(prev =>
          prev?.length > 0 ? [...prev, hashtag] : [hashtag]
        );
      }
      setHashtag("");
    }
  };

  const onChangeHashtag = (e: any) => {
    setHashtag(e?.target?.value?.trim());
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== tag));
  };

  useEffect(() => {
    autoResize();
  }, [content]);

  const handleClickSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (post) {
        if (user!.uid === post?.uid) {
          const postRef = doc(db, "posts", post.id);
          await updateDoc(postRef, {
            content: content,
            hashtags: hashtags,
          });
          toast.success("게시글을 수정했습니다.");
        } else {
          toast.success("게시글 작성자가 아닙니다.");
        }
      } else {
        const result = await addDoc(collection(db, "posts"), {
          content: content,
          createdAt: new Date()?.toLocaleDateString("en", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
          uid: user?.uid,
          userId: user?.userId,
          email: user?.email,
          hashtags: hashtags,
          parentPostId: parentPostId ?? "root",
        });
        if (parentPostId) {
          const postRef = doc(db, "posts", parentPostId);
          await updateDoc(postRef, {
            comments: arrayUnion(result.id),
          });
        }
        toast.success("글을 게시했습니다.");
      }
    } catch (error) {
      toast.success("실패하였습니다.");
    } finally {
      setHashtag("");
      setHashtags([]);
      setContent("");
      navigate(-1);
    }
  };

  useEffect(() => {
    setPost(defaultPost);
  }, [defaultPost]);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setHashtags(post.hashtags || []);
    }
  }, [post]);

  return (
    <div className='post-input'>
      <Link to={isEdit ? "" : `/posts/new`}>
        <div className='post-input__box'>
          <div className='post-input__box-profile'>
            <img
              className='post-input__box-profile-image'
              src={user?.imageUrl || ""}
              alt=''
            />
          </div>
          <div className='post-input__box-body'>
            <div className='post-input__box-body-username'>
              {user?.userId || ""}
            </div>
            <div className='post-input__box-body-content'>
              {isEdit ? (
                <>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder='새로운 소식이 있나요?'
                    rows={1}
                    style={{
                      width: "100%",
                      resize: "none",
                      overflow: "hidden",
                      minHeight: "50px",
                      whiteSpace: "pre-wrap",
                    }}
                  />
                  <div className='post-input__box-body-content-hashtags'>
                    <div className='hashtag-list'>
                      {hashtags?.map((tag, index) => (
                        <span
                          key={index}
                          className='item'
                          onClick={() => {
                            removeHashtag(tag);
                          }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {isEdit && (
                      <input
                        className='hashtag-input'
                        name='hashtag'
                        id='hashtag'
                        placeholder='해시태그를 입력해주세요.'
                        onChange={onChangeHashtag}
                        onKeyUp={handleKeyUp}
                        value={hashtag}
                      />
                    )}
                  </div>
                </>
              ) : (
                "새로운 소식이 있나요?"
              )}
            </div>
            {/* <div className='post-input__box-body-buttons'>
              <LuImage className='icon' />
              <MdOutlinePhotoCamera className='icon' />
              <MdOutlineGifBox className='icon' />
              <FiMic className='icon' />
              <RiHashtag className='icon' />
              <CgMenuLeft className='icon' />
            </div> */}
            <div className='post-input__box-body-btn'>
              {isEdit && <button onClick={handleClickSubmit}>게시</button>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostInput;
