import {useState, useEffect, useRef, ChangeEvent} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {app, db, storage} from "firebaseApp";

import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";

import {checkDuplicatedUserId} from "utils/UserUtils";
import Checkbox from "components/checkbox/Checkbox";

import "./Profile.module.scss";

const ProfileNewSetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const profileImageRef = useRef<HTMLInputElement>(null);

  const createUserData = async (e: any) => {
    e.preventDefault();
    // Validation
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

    const {uid, email, password} = location.state || {};

    // 사용자 프로필 이미지 업로드
    const key = `profiles/${uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let imageUrl = "";
    try {
      if (profileImage) {
        const data = await uploadString(storageRef, profileImage, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      } else {
        setErrorMsg("프로필 이미지를 넣어주세요.");
        return;
      }
    } catch (error) {
      setErrorMsg("프로필 이미지를 업로드하는데 실패하였습니다.");
      return;
    } finally {
      setProfileImage(null);
    }
    if (!imageUrl) {
      setErrorMsg("프로필 이미지가 인식되지 않았습니다.");
      return;
    }

    // 사용자 정보 입력하고 회원가입
    try {
      const userRef = doc(db, "users", uid);
      const newUserData = {
        uid: uid,
        email: email,
        name: name,
        userId: userId,
        introduction: intro,
        isPrivate: isPrivate,
        imageUrl: imageUrl,
      };
      await setDoc(userRef, newUserData);
      await signInWithEmailAndPassword(getAuth(app), email, password);
      toast.success("회원가입 되었습니다.");
      navigate("/");
    } catch (error) {
      toast.error("프로필 생성에 실패했습니다.");
      return;
    }
  };

  const onClickProfileImage = () => {
    if (profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  const changeProfileImage = (e: ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (!name || !userId || !intro) {
      setErrorMsg("");
    }
  }, [name, userId, intro]);

  return (
    <div className='profile-edit'>
      <div className='profile-edit__appbar'>
        <div className='profile-edit__appbar-box-left'>
          <span>프로필 생성</span>
        </div>
        <button
          className='profile-edit__appbar-right'
          onClick={createUserData}>
          <span>완료</span>
        </button>
      </div>
      <div className='profile-edit__body'>
        <div className='profile-edit__body-box'>
          <div className='profile-edit__body-box-name-and-image'>
            <div className='name'>
              <span>이름</span>
              <input
                placeholder='이름을 입력해주세요.'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div
              className='image'
              onClick={onClickProfileImage}>
              <img
                className='img'
                src={
                  profileImage ||
                  "https://firebasestorage.googleapis.com/v0/b/welshier.appspot.com/o/profiles%2Fdefault%2Fdefault-profile?alt=media&token=cc70557c-d6c7-4173-9e68-26f8b8fb2cc5"
                }
                alt=''
              />
              <input
                type='file'
                ref={profileImageRef}
                accept='image/*'
                onChange={changeProfileImage}
                style={{display: "none"}}
              />
            </div>
          </div>
          <div className='profile-edit__body-box-id'>
            <div className='id'>
              <span>아이디</span>
              <input
                placeholder='아이디를 입력해주세요.'
                value={userId}
                onChange={e => setUserId(e.target.value)}
              />
            </div>
          </div>
          <div className='profile-edit__body-box-introduce'>
            <div className='introduce'>
              <span>소개</span>
              <input
                placeholder='소개를 입력해주세요.'
                value={intro}
                onChange={e => setIntro(e.target.value)}
              />
            </div>
          </div>
          <div className='profile-edit__body-box-private-profile'>
            <div className='private-profile'>
              <span>비공개 프로필</span>
              <span className='info'>
                비공개 프로필로 전환하면 상대방이 회원님을 팔로우하지 않는 한
                다른 사람에게 답글을 남길 수 없게 됩니다.
              </span>
            </div>
            <div className='image'>
              <Checkbox
                onClick={isTrue => setIsPrivate(isTrue)}
                isChecked={isPrivate}
              />
            </div>
          </div>
          {!!errorMsg && (
            <div className='error-msg'>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNewSetPage;
