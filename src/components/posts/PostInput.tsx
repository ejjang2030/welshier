import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiHashtag } from "react-icons/ri";
import { FiMic } from "react-icons/fi";
import { MdOutlineGifBox } from "react-icons/md";
import { CgMenuLeft } from "react-icons/cg";
import { LuImage } from "react-icons/lu";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useContext } from "react";
import AuthContext from "context/AuthContext";

const PostInput = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    console.log(value);
    autoResize();
  }, [value]);

  return (
    <div className="post-input">
      <Link to={`/posts/new`}>
        <div className="post-input__box">
          <div className="post-input__box-profile">
            <div className="post-input__box-profile-image"></div>
          </div>
          <div className="post-input__box-body">
            <div className="post-input__box-body-username">{user?.email}</div>
            <div className="post-input__box-body-content">
              {isEdit ? (
                <>
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="새로운 소식이 있나요?"
                    rows={1}
                    style={{
                      width: "100%",
                      resize: "none",
                      overflow: "hidden",
                      minHeight: "50px",
                    }}
                  />
                </>
              ) : (
                "새로운 소식이 있나요?"
              )}
            </div>
            <div className="post-input__box-body-buttons">
              <LuImage className="icon" />
              <MdOutlinePhotoCamera className="icon" />
              <MdOutlineGifBox className="icon" />
              <FiMic className="icon" />
              <RiHashtag className="icon" />
              <CgMenuLeft className="icon" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostInput;
