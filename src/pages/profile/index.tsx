import { useState, useEffect, useCallback, useContext } from "react";

import { GoGlobe as GlobalIcon } from "react-icons/go";
import { BsList as MenuIcon } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  checkDuplicatedUserId,
  getUidByUserId,
  getUserByUid,
  getUserByUserId,
} from "utils/UserUtils";

import { DocumentData } from "firebase/firestore";

interface UserData {
  name: string;
  userId: string;
  introduction: string;
  isPrivate: boolean;
  imageUrl: string;
}

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [userData, setUserData] = useState<DocumentData | undefined>();
  const [isItMe, setIsItMe] = useState<boolean>(false);
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

  useEffect(() => {
    getUserByUid(user!.uid, (uData) => {
      setUserData(uData);
    });
  }, [user]);

  useEffect(() => {
    const currUserId = location.pathname.split("@")[1] as string;
    getUidByUserId(currUserId, (uid) => {
      setIsItMe(uid === user!.uid);
    });
    getUserByUserId(currUserId).then((uData) => {
      setUserData(uData);
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile__appbar">
        <GlobalIcon className="profile__appbar-left" />
        <MenuIcon
          className="profile__appbar-right"
          onClick={() => navigate("/settings")}
        />
      </div>
      <div className="profile__my-profile">
        <div className="profile__my-profile-body">
          <div className="profile__my-profile-body-content">
            <div className="name">{userData?.name}</div>
            <div className="id">{userData?.userId}</div>
          </div>
          <img
            src={userData?.imageUrl}
            alt=""
            className="profile__my-profile-body-image"
          />
        </div>
        <div className="profile__my-profile-role">{userData?.introduction}</div>
        <div className="profile__my-profile-followers">
          <div className="images">
            <div className="img1"></div>
            <div className="img2"></div>
          </div>
          <div className="followers">팔로워 66명</div>
        </div>
        <div className="profile__my-profile-buttons">
          {isItMe ? (
            <button onClick={() => navigate("/profile/edit")}>
              프로필 편집
            </button>
          ) : (
            <button
              className="follow-btn"
              onClick={() => console.log("follow")}
            >
              팔로우
            </button>
          )}

          <button>프로필 공유</button>
        </div>
      </div>
      <div className="profile__tabs">
        <div
          className={getTabClass("threads")}
          onClick={() => setCurrTab("threads")}
        >
          스레드
        </div>
        <div
          className={getTabClass("comments")}
          onClick={() => setCurrTab("comments")}
        >
          답글
        </div>
        <div
          className={getTabClass("reposts")}
          onClick={() => setCurrTab("reposts")}
        >
          리포스트
        </div>
      </div>
      <div className="profile__body">
        <PostBox
          post={{
            id: "sdfsdsdf",
            email: "ejjang2030@gmail.com",
            content: "내용입니다.",
            createdAt: "2024-09-14",
            uid: "bTmDAGxyzwWR1imWno9x2IJE5jn2",
            profileUrl:
              "https://firebasestorage.googleapis.com/v0/b/welshier.appspot.com/o/profiles%2FbTmDAGxyzwWR1imWno9x2IJE5jn2%2F58ae5356-f893-4bee-a01b-e3e016fc9904?alt=media&token=9768b439-c1f8-4d24-85d1-654408dcadde",
            likes: [""],
            likeCount: 31,
            comments: null,
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
