import {Link} from "react-router-dom";
import {RiHashtag} from "react-icons/ri";
import {FiMic} from "react-icons/fi";
import {MdOutlineGifBox} from "react-icons/md";
import {CgMenuLeft} from "react-icons/cg";
import {LuImage} from "react-icons/lu";
import {MdOutlinePhotoCamera} from "react-icons/md";

const PostInput = () => {
  return (
    <div className='post-input'>
      <Link to={`/posts/new`}>
        <div className='post-input__box'>
          <div className='post-input__box-profile'>
            <div className='post-input__box-profile-image'></div>
          </div>
          <div className='post-input__box-body'>
            <div className='post-input__box-body-username'>ejjang2030</div>
            <div className='post-input__box-body-content'>
              새로운 소식이 있나요?
            </div>
            <div className='post-input__box-body-buttons'>
              <LuImage className='icon' />
              <MdOutlinePhotoCamera className='icon' />
              <MdOutlineGifBox className='icon' />
              <FiMic className='icon' />
              <RiHashtag className='icon' />
              <CgMenuLeft className='icon' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostInput;
