import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import "./Profile.module.scss";
import Checkbox from "components/checkbox/Checkbox";
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
} from "firebase/firestore";
import { app, db, storage } from "firebaseApp";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";
import { checkDuplicatedUserId, getUserByUserId } from "utils/UserUtils";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

const ProfileEditPage = ({ isSignup = false }) => {
  const { user, isNotSetProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const profileImageRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleBack = async () => {
    navigate(-1);
  };

  const handleComplete = async (e: any) => {
    if (!name) {
      setErrorMsg("이름을 입력해주세요.");
      return;
    }
    if (!userId) {
      setErrorMsg("아이디를 입력해주세요.");
      return;
    }
    const isDuplicatedUserId = await checkDuplicatedUserId(userId);
    if (isDuplicatedUserId) {
      setErrorMsg("중복된 아이디가 존재합니다.");
      return;
    }
    if (!intro) {
      setErrorMsg("소개를 입력해주세요");
      return;
    }
    const userRef = doc(db, "users", user!.uid);
    setIsUploading(true);
    const key = `profiles/${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();
    const userSnapshot = await getDoc(userRef);
    try {
      let imageUrl = "";
      if (profileImage) {
        const data = await uploadString(storageRef, profileImage, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }
      await setDoc(
        userRef,
        {
          name: name,
          userId: userId,
          introduction: intro,
          isPrivate: isPrivate,
          imageUrl: imageUrl,
        },
        { ...(userSnapshot.exists() ? { merge: true } : {}) }
      );
      setProfileImage(null);
    } catch (error) {
      toast.error("프로필 수정에 실패했습니다.");
    }
    setIsUploading(false);
    toast.success("프로필이 수정되었습니다.");
    navigate(-1);
  };

  const setUserData = async () => {
    const userRef = doc(db, "users", user!.uid);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    if (userData) {
      setName(userData.name);
      setUserId(userData.userId);
      setIntro(userData.introduction);
      setIsPrivate(userData.isPrivate);
      console.log(userData.imageUrl);
      setProfileImage(
        userData.imageUrl ||
          "https://firebasestorage.googleapis.com/v0/b/welshier.appspot.com/o/profiles%2Fdefault%2Fdefault-profile?alt=media&token=cc70557c-d6c7-4173-9e68-26f8b8fb2cc5"
      );
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(image!);
    fileReader.onloadend = (e: any) => {
      const result = e?.currentTarget?.result;
      if (result) {
        setProfileImage(result);
      }
    };
  };
  const handleProfileImage = () => {
    if (profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  useEffect(() => {
    setUserData();
  }, []);

  return (
    <div className="profile-edit">
      <div className="profile-edit__appbar">
        <div className="profile-edit__appbar-box-left">
          <CloseIcon
            className="profile-edit__appbar-left"
            onClick={handleBack}
          />
          <span>프로필 편집</span>
        </div>
        <button className="profile-edit__appbar-right" onClick={handleComplete}>
          <span>완료</span>
        </button>
      </div>
      <div className="profile-edit__body">
        <div className="profile-edit__body-box">
          <div className="profile-edit__body-box-name-and-image">
            <div className="name">
              <span>이름</span>
              <input
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="image" onClick={handleProfileImage}>
              <img
                className="img"
                src={
                  profileImage ||
                  "https://firebasestorage.googleapis.com/v0/b/welshier.appspot.com/o/profiles%2Fdefault%2Fdefault-profile?alt=media&token=cc70557c-d6c7-4173-9e68-26f8b8fb2cc5"
                }
                alt=""
              />
              <input
                type="file"
                ref={profileImageRef}
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="profile-edit__body-box-id">
            <div className="id">
              <span>아이디</span>
              <input
                placeholder="아이디를 입력해주세요."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>
          <div className="profile-edit__body-box-introduce">
            <div className="introduce">
              <span>소개</span>
              <input
                placeholder="소개를 입력해주세요."
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </div>
          </div>
          <div className="profile-edit__body-box-private-profile">
            <div className="private-profile">
              <span>비공개 프로필</span>
              <span className="info">
                비공개 프로필로 전환하면 상대방이 회원님을 팔로우하지 않는 한
                다른 사람에게 답글을 남길 수 없게 됩니다.
              </span>
            </div>
            <div className="image">
              <Checkbox
                onClick={(isTrue) => setIsPrivate(isTrue)}
                isChecked={isPrivate}
              />
            </div>
          </div>
          {!!errorMsg && (
            <div className="error-msg">
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
