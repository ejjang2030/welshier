import {useState, useCallback, useContext} from "react";

import {HiOutlineGlobeAlt} from "react-icons/hi2";
import {RiMenuLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";

const ProfilePage = () => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [currTab, setCurrTab] = useState<"threads" | "comments" | "reposts">(
    "threads"
  );

  const getTabClass = useCallback(
    (tabName: "threads" | "comments" | "reposts") => {
      if (currTab === tabName) return "profile__tabs-tab active";
      else return "profile__tabs-tab";
    },
    [currTab]
  );

  return (
    <div className='profile'>
      <div className='profile__appbar'>
        <HiOutlineGlobeAlt className='profile__appbar-left' />
        <RiMenuLine
          className='profile__appbar-right'
          onClick={() => navigate("/settings")}
        />
      </div>
      <div className='profile__my-profile'>
        <div className='profile__my-profile-body'>
          <div className='profile__my-profile-body-content'>
            <div className='name'>장은재</div>
            <div className='id'>{user?.email}</div>
          </div>
          <div className='profile__my-profile-body-image'></div>
        </div>
        <div className='profile__my-profile-role'>
          Android Developer | Web Developer
        </div>
        <div className='profile__my-profile-followers'>
          <div className='images'>
            <div className='img1'></div>
            <div className='img2'></div>
          </div>
          <div className='followers'>팔로워 66명</div>
        </div>
        <div className='profile__my-profile-buttons'>
          <button>프로필 편집</button>
          <button>프로필 공유</button>
        </div>
      </div>
      <div className='profile__tabs'>
        <div
          className={getTabClass("threads")}
          onClick={() => setCurrTab("threads")}>
          스레드
        </div>
        <div
          className={getTabClass("comments")}
          onClick={() => setCurrTab("comments")}>
          답글
        </div>
        <div
          className={getTabClass("reposts")}
          onClick={() => setCurrTab("reposts")}>
          리포스트
        </div>
      </div>
      <div className='profile__body'>
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
      </div>
    </div>
  );
};

export default ProfilePage;
