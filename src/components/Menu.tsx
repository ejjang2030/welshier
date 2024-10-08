import {MouseEvent, useCallback, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import {FaRegHeart} from "react-icons/fa";

// home icon
import {GoHome as HomeIconOutline} from "react-icons/go";
import {GoHomeFill as HomeIconFill} from "react-icons/go";
// search icon
import {GoSearch as SearchIcon} from "react-icons/go";
// plus icon
import {GoPlus as PlusIcon} from "react-icons/go";
// heart icon
import {GoHeart as HeartIconOutline} from "react-icons/go";
import {GoHeartFill as HeartIconFill} from "react-icons/go";
// profile icon
import {GoPersonFill as ProfileIconFill} from "react-icons/go";
import {GoPerson as ProfileIconOutline} from "react-icons/go";
import {useContext, useState} from "react";
import AuthContext from "context/AuthContext";
import {getUserIdByUid} from "utils/UserUtils";
import {collection, doc, onSnapshot, query, where} from "firebase/firestore";
import {db} from "firebaseApp";

type Tabs = "home" | "search" | "add-post" | "notifications" | "profile";

const MenuList = () => {
  const location = useLocation();
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [currTab, setCurrTab] = useState<Tabs>("home");
  const [existActivity, setExistActivity] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      const pathname = location.pathname;
      if (pathname === "/") setCurrTab("home");
      if (pathname.includes("/search")) setCurrTab("search");
      if (pathname.includes("/posts")) setCurrTab("add-post");
      if (pathname.includes("/notifications")) setCurrTab("notifications");
      if (pathname.includes("/profile")) setCurrTab("profile");
    }
  }, [location]);

  const getExistActivity = useCallback(async () => {
    if (user) {
      const postRef = doc(db, "activities", user!.uid);
      const collectionRef = collection(postRef, "activities");
      const existUnreadActivities = query(
        collectionRef,
        where("isRead", "==", false)
      );
      onSnapshot(existUnreadActivities, snapshot => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          setExistActivity(true);
        } else {
          setExistActivity(false);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getExistActivity();
    }
  }, [currTab, user]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>, name: Tabs) => {
    setCurrTab(name);
    switch (name) {
      case "home": {
        navigate("/");
        break;
      }
      case "search": {
        navigate(`/search`);
        break;
      }
      case "add-post": {
        navigate(`/posts/new`);
        break;
      }
      case "notifications": {
        navigate(`/notifications`);
        break;
      }
      case "profile": {
        getUserIdByUid(user!.uid, userId => {
          navigate(`/profile/@${userId}`);
        });
        break;
      }
    }
  };

  return (
    <div className='footer'>
      <div className='footer__grid'>
        <button
          type='button'
          className='button'
          id='home'
          onClick={e => handleClick(e, "home")}>
          {currTab === "home" ? (
            <HomeIconFill className='icon' />
          ) : (
            <HomeIconOutline className='icon' />
          )}
        </button>
        <button
          type='button'
          className='button'
          id='search'
          onClick={e => handleClick(e, "search")}>
          <SearchIcon className='icon' />
        </button>
        <button
          type='button'
          className='button button__main-plus'
          id='add-post'
          onClick={e => handleClick(e, "add-post")}>
          <PlusIcon className='icon' />
        </button>
        <button
          type='button'
          className='button'
          id='notifications'
          onClick={e => handleClick(e, "notifications")}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
          {currTab === "notifications" ? (
            <HeartIconFill className='icon' />
          ) : (
            <HeartIconOutline className='icon' />
          )}
          {existActivity && (
            <div
              style={{
                backgroundColor: "red",
                width: "5px",
                height: "5px",
                borderRadius: "999px",
                color: "red",
              }}></div>
          )}
        </button>
        <button
          type='button'
          className='button'
          id='profile'
          onClick={e => handleClick(e, "profile")}>
          {currTab === "profile" ? (
            <ProfileIconFill className='icon' />
          ) : (
            <ProfileIconOutline className='icon' />
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuList;
