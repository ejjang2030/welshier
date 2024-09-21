import {useState, useEffect, useCallback, useContext, useMemo} from "react";

import {GoGlobe as GlobalIcon} from "react-icons/go";
import {BsList as MenuIcon} from "react-icons/bs";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "context/AuthContext";
import {
  getTwoUserImageUrlsFromFollowers,
  getUserDataByUserId,
} from "utils/UserUtils";

import {
  and,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import PostList from "components/posts/PostList";
import {Follower, Post, UserData} from "types";

const ProfilePage = () => {
  const {user} = useContext(AuthContext);
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | undefined>();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [commentPosts, setCommentPosts] = useState<Post[]>([]);
  const [likePosts, setLikePosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followersImageUrls, setFollowersImageUrls] = useState<string[]>([]);
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

  const handleCancelFollow = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (user && user.uid && userData) {
        const followingsRef = doc(db, "followings", user.uid);
        await updateDoc(followingsRef, {
          users: arrayRemove({id: userData.uid}),
        });
        const followersRef = doc(db, "followers", userData.uid);
        await updateDoc(followersRef, {
          users: arrayRemove({id: user.uid}),
        });
      }
    },
    [userData, user]
  );

  const handleFollow = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (user && user.uid && userData) {
        // 현재 로그인된 사용자가 해당 프로필의 사용자를 팔로우하는 로직
        const followingsRef = doc(db, "followings", user.uid);
        await setDoc(
          followingsRef,
          {users: arrayUnion({id: userData.uid})},
          {merge: true}
        );
        // 해당 프로필의 사용자가 현재 로그인된 사용자를 팔로잉 당하는 로직
        const followersRef = doc(db, "followers", userData.uid);
        await setDoc(
          followersRef,
          {users: arrayUnion({id: user.uid})},
          {merge: true}
        );
      }
    },
    [userData, user]
  );

  useEffect(() => {
    const currUserId = location.pathname.split("@")[1] as string;
    getUserDataByUserId(currUserId).then(uData => {
      setUserData(uData);
    });
  }, []);

  const isFollow = useMemo(() => {
    return user && followers.map(follower => follower.id).includes(user.uid);
  }, [user, followers]);

  useEffect(() => {
    if (userData) {
      // 현재 프로필의 사용자와 로그인해서 접속된 사용자의 일치여부 판단
      if (user && user.uid) {
        setIsItMe(userData.uid === user!.uid);
      }

      // 현재 프로필의 사용자를 팔로우한 사람들의 목록 조회
      const followersRef = doc(db, "followers", userData.uid);
      onSnapshot(followersRef, doc => {
        setFollowers([]);
        doc?.data()?.users?.map((user: Follower) => {
          setFollowers(prev => (prev ? [...prev, {id: user.id}] : []));
        });
      });

      const postsRef = collection(db, "posts");

      // 현재 프로필의 사용자가 게시한 글 목록 조회
      const myPostQuery = query(
        postsRef,
        and(
          where("uid", "==", userData.uid),
          where("parentPostId", "==", "root")
        ),
        orderBy("createdAt", "desc")
      );
      onSnapshot(myPostQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as Post[]);
      });

      // 현재 프로필의 사용자가 게시글의 댓글을 단 목록 조회
      const commentPostQuery = query(
        postsRef,
        and(
          where("uid", "==", userData.uid),
          where("parentPostId", "!=", "root")
        ),
        orderBy("createdAt", "desc")
      );
      onSnapshot(commentPostQuery, snapshot => {
        let parentPostIds = [
          ...snapshot.docs.map(doc => doc?.data().parentPostId),
        ];
        if (parentPostIds && parentPostIds.length > 0) {
          const parentPostQuery = query(
            postsRef,
            where(documentId(), "in", parentPostIds),
            orderBy("createdAt", "desc")
          );
          getDocs(parentPostQuery).then(value => {
            let dataObj = value.docs.map(doc => ({...doc.data(), id: doc?.id}));
            setCommentPosts(dataObj as Post[]);
          });
        }
      });

      // 현재 프로필의 사용자가 좋아요를 표시한 게시글 목록 조회
      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", userData.uid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(likePostQuery, snapshot => {
        let dataObj = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as Post[]);
      });
    }
  }, [userData, user]);

  useEffect(() => {
    if (followers) {
      getTwoUserImageUrlsFromFollowers(followers, (imageUrls: string[]) => {
        setFollowersImageUrls(imageUrls);
      });
    }
  }, [followers]);

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
          {followers.length > 0 && followersImageUrls.length !== 0 && (
            <div className='images'>
              {followersImageUrls.map((imageUrl, index) => (
                <img
                  key={`img${index + 1}`}
                  className={`img${index + 1}`}
                  src={imageUrl}
                  alt=''
                />
              ))}
            </div>
          )}
          <div
            className={
              followersImageUrls.length > 1
                ? "followers"
                : followersImageUrls.length === 1
                ? "follower"
                : "no-follower"
            }>
            팔로워 {followers.length || 0}명
          </div>
        </div>
        <div className='profile__my-profile-buttons'>
          {isItMe ? (
            <button onClick={() => navigate("/profile/edit")}>
              프로필 편집
            </button>
          ) : (
            <>
              {isFollow ? (
                <button
                  className='followed-btn'
                  onClick={handleCancelFollow}>
                  팔로잉
                </button>
              ) : (
                <button
                  className='follow-btn'
                  onClick={handleFollow}>
                  팔로우
                </button>
              )}
            </>
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
        {!isItMe && userData?.isPrivate && !isFollow ? (
          <div className='no-contents'>비공개 프로필입니다.</div>
        ) : (
          <>
            {currTab === "threads" && (
              <>
                {myPosts?.length ? (
                  <PostList
                    name='myPosts'
                    posts={myPosts}
                  />
                ) : (
                  <div className='no-contents'>게시글이 없습니다.</div>
                )}
              </>
            )}
            {currTab === "comments" && (
              <>
                {commentPosts?.length ? (
                  <PostList
                    name='comments'
                    posts={commentPosts}
                  />
                ) : (
                  <div className='no-contents'>게시글이 없습니다.</div>
                )}
              </>
            )}
            {currTab === "reposts" && (
              <>
                {likePosts?.length ? (
                  <PostList
                    name='likes'
                    posts={likePosts}
                  />
                ) : (
                  <div className='no-contents'>게시글이 없습니다.</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
