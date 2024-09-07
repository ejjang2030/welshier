import {useNavigate} from "react-router-dom";
import {GoHomeFill} from "react-icons/go";
import {IoSearch} from "react-icons/io5";
import {FaPlus} from "react-icons/fa";
import {FaRegHeart} from "react-icons/fa";
import {FaRegUser} from "react-icons/fa";

const MenuList = () => {
  const navigate = useNavigate();

  return (
    <div className='footer'>
      <div className='footer__grid'>
        <button
          type='button'
          className='button'
          onClick={() => navigate("/")}>
          <GoHomeFill className='icon' />
        </button>
        <button
          type='button'
          className='button'
          onClick={() => navigate("/search")}>
          <IoSearch className='icon' />
        </button>
        <button
          type='button'
          className='button button__main-plus'
          onClick={() => navigate("/posts/new")}>
          <FaPlus className='icon' />
        </button>
        <button
          type='button'
          className='button'
          onClick={() => navigate("/notifications")}>
          <FaRegHeart className='icon' />
        </button>
        <button
          type='button'
          className='button'
          onClick={() => navigate("/profile")}>
          <FaRegUser className='icon' />
        </button>
        {/* <button
          type='button'
          className='button'
          onClick={() => navigate("/login")}>
          로그아웃
        </button> */}
      </div>
    </div>
  );
};

export default MenuList;
