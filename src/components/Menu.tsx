import { MouseEvent } from "react";
import {useNavigate} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import {FaRegHeart} from "react-icons/fa";

// home icon
import { GoHome as HomeIconOutline } from "react-icons/go";
import { GoHomeFill as HomeIconFill } from "react-icons/go";
// search icon
import { GoSearch as SearchIcon } from "react-icons/go";
// plus icon
import { GoPlus as PlusIcon } from "react-icons/go";
// heart icon
import { GoHeart as HeartIconOutline } from "react-icons/go";
import { GoHeartFill as HeartIconFill } from "react-icons/go";
// profile icon
import { GoPersonFill as ProfileIconFill } from "react-icons/go";
import { GoPerson as ProfileIconOutline } from "react-icons/go";
import { useContext, useState } from "react";
import AuthContext from "context/AuthContext";
import { getUserIdByUid } from "utils/UserUtils";

type Tabs = 'home' | 'search' | 'add-post' | 'notifications' | 'profile';

const MenuList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currTab, setCurrTab] = useState<Tabs>('home');

  const handleClick = async (e: MouseEvent<HTMLButtonElement>, name: Tabs) => {
    setCurrTab(name);
    switch(name) {
      case 'home': {
        navigate('/');
        break;
      }
      case 'search': {
        navigate(`/search`);
        break;
      }
      case 'add-post': {
        navigate(`/posts/new`);
        break;
      }
      case 'notifications': {
        navigate(`/notifications`);
        break;
      }
      case 'profile': {
        let userId = await getUserIdByUid(user!.uid);
        navigate(`/profile/@${userId}`);
        break;
      }
    }
  }

  return (
    <div className='footer'>
      <div className='footer__grid'>
        <button
          type='button'
          className='button'
          id='home'
          onClick={(e) => handleClick(e, 'home')}>
          {currTab === 'home' ? <HomeIconFill className='icon' /> : <HomeIconOutline className='icon' />}
        </button>
        <button
          type='button'
          className='button'
          id='search'
          onClick={(e) => handleClick(e, 'search')}>
          <SearchIcon className='icon' />
        </button>
        <button
          type='button'
          className='button button__main-plus'
          id='add-post'
          onClick={(e) => handleClick(e, 'add-post')}>
          <PlusIcon className='icon' />
        </button>
        <button
          type='button'
          className='button'
          id='notifications'
          onClick={(e) => handleClick(e, 'notifications')}>
          {currTab === 'notifications' ? <HeartIconFill className='icon' /> : <HeartIconOutline className='icon' />}
        </button>
        <button
          type='button'
          className='button'
          id='profile'
          onClick={(e) => handleClick(e, 'profile')}>
          {currTab === 'profile' ? <ProfileIconFill className='icon' /> : <ProfileIconOutline className='icon' />}
        </button>
      </div>
    </div>
  );
};

export default MenuList;
