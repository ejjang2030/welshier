import {useState, useEffect, useCallback, useContext} from "react";

import {GoGlobe as GlobalIcon} from "react-icons/go";
import {BsList as MenuIcon} from "react-icons/bs";
import {useLocation, useNavigate} from "react-router-dom";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  checkDuplicatedUserId,
  getUidByUserId,
  getUserByUid,
  getUserByUserId,
} from "utils/UserUtils";

import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {PostProps} from "pages/home";
import {db} from "firebaseApp";
import PostList from "components/posts/PostList";

interface UserData {
  name: string;
  userId: string;
  introduction: string;
  isPrivate: boolean;
  imageUrl: string;
}

const ProfilePage = () => {
  const {user} = useContext(AuthContext);
  const location = useLocation();
  const [userData, setUserData] = useState<DocumentData | undefined>();
  const [currProfileUserUid, setCurrProfileUserUid] = useState<string>("");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
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
    const currUserId = location.pathname.split("@")[1] as string;
    getUidByUserId(currUserId, uid => {
      setCurrProfileUserUid(uid);
    });
    getUserByUserId(currUserId).then(uData => {
      setUserData(uData);
    });
  }, []);

  useEffect(() => {
    if (currProfileUserUid) {
      if (user && user.uid) {
        setIsItMe(currProfileUserUid === user!.uid);
      }
      const postsRef = collection(db, "posts");
      const myPostQuery = query(
        postsRef,
        where("uid", "==", currProfileUserUid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(myPostQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });
      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", currProfileUserUid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(likePostQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as PostProps[]);
      });
    }
  }, [currProfileUserUid, user]);

  return (
    <div className='profile'>
      <div className='profile__appbar'>
        <GlobalIcon className='profile__appbar-left' />
        <MenuIcon
          className='profile__appbar-right'
          onClick={() => navigate("/settings")}
        />
      </div>
      <div className='profile__my-profile'>
        <div className='profile__my-profile-body'>
          <div className='profile__my-profile-body-content'>
            <div className='name'>{userData?.name}</div>
            <div className='id'>{userData?.userId}</div>
          </div>
          <img
            src={userData?.imageUrl}
            alt=''
            className='profile__my-profile-body-image'
          />
        </div>
        <div className='profile__my-profile-role'>{userData?.introduction}</div>
        <div className='profile__my-profile-followers'>
          <div className='images'>
            <div className='img1'></div>
            <div className='img2'></div>
          </div>
          <div className='followers'>팔로워 66명</div>
        </div>
        <div className='profile__my-profile-buttons'>
          {isItMe ? (
            <button onClick={() => navigate("/profile/edit")}>
              프로필 편집
            </button>
          ) : (
            <button
              className='follow-btn'
              onClick={() => console.log("follow")}>
              팔로우
            </button>
          )}

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
          좋아요
        </div>
      </div>
      <div className='profile__body'>
        {currTab === "threads" && (
          <>
            {myPosts?.length ? (
              <PostList posts={myPosts} />
            ) : (
              <>게시글이 없습니다.</>
            )}
          </>
        )}
        {currTab === "reposts" && (
          <>
            {likePosts?.length ? (
              <PostList posts={likePosts} />
            ) : (
              <>게시글이 없습니다.</>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
