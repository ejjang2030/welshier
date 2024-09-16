import {useRef, useState, useEffect, useCallback} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {RiHashtag} from "react-icons/ri";
import {FiMic} from "react-icons/fi";
import {MdOutlineGifBox} from "react-icons/md";
import {CgMenuLeft} from "react-icons/cg";
import {LuImage} from "react-icons/lu";
import {MdOutlinePhotoCamera} from "react-icons/md";
import {useContext} from "react";
import AuthContext from "context/AuthContext";
import {getUserDataByUid} from "utils/UserUtils";
import {addDoc, collection, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "firebaseApp";
import {toast} from "react-toastify";
import {Post} from "types";

const PostInput = ({isEdit = false}: {isEdit?: boolean}) => {
  const {id: postId} = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [content, setContent] = useState<string>("");
  const [userData, setUserData] = useState<any>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

  const handleClickSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (postId) {
        if (user!.uid === post?.uid) {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, {
            content: content,
            hashtags: hashtags,
          });
          toast.success("게시글을 수정했습니다.");
        } else {
          toast.success("게시글 작성자가 아닙니다.");
        }
      } else {
        await addDoc(collection(db, "posts"), {
          content: content,
          createdAt: new Date()?.toLocaleDateString("en", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
          uid: user?.uid,
          userId: userData?.userId,
          email: user?.email,
          hashtags: hashtags,
        });
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

  const getPost = useCallback(async () => {
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      setPost({...(postSnapshot.data() as Post), id: postSnapshot.id});
      setContent(postSnapshot?.data()?.content);
      setHashtags(postSnapshot?.data()?.hashtags || []);
    }
  }, [postId]);

  useEffect(() => {
    autoResize();
  }, [content]);

  useEffect(() => {
    if (user) {
      getUserDataByUid(user.uid, uData => {
        setUserData(uData);
      });
    }
  }, []);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [getPost, postId]);

  return (
    <div className='post-input'>
      <Link to={isEdit ? "" : `/posts/new`}>
        <div className='post-input__box'>
          <div className='post-input__box-profile'>
            <img
              className='post-input__box-profile-image'
              src={userData?.imageUrl || ""}
              alt=''
            />
          </div>
          <div className='post-input__box-body'>
            <div className='post-input__box-body-username'>
              {userData?.userId || ""}
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
                          onClick={() => removeHashtag(tag)}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <input
                      className='hashtag-input'
                      name='hashtag'
                      id='hashtag'
                      placeholder='해시태그를 입력해주세요.'
                      onChange={onChangeHashtag}
                      onKeyUp={handleKeyUp}
                      value={hashtag}
                    />
                  </div>
                </>
              ) : (
                "새로운 소식이 있나요?"
              )}
            </div>
            <div className='post-input__box-body-buttons'>
              <LuImage className='icon' />
              <MdOutlinePhotoCamera className='icon' />
              <MdOutlineGifBox className='icon' />
              <FiMic className='icon' />
              <RiHashtag className='icon' />
              <CgMenuLeft className='icon' />
            </div>
            <div>
              {isEdit && <button onClick={handleClickSubmit}>게시</button>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostInput;
