import { BsHeart as HeartIconOutline } from "react-icons/bs";
import { BsChat as ChatIcon } from "react-icons/bs";
import { BsThreeDots as ThreeDotsIcon } from "react-icons/bs";
import { MdOutlineInput as RepostIcon } from "react-icons/md";
import { BsSend as SendIcon } from "react-icons/bs";
import AuthContext from "context/AuthContext";
import { useContext } from "react";

const PostBox = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile__body-box">
      <div className="image">
        <div className="img"></div>
      </div>
      <div className="content">
        <div className="profile-and-menu">
          <div className="profile">
            {user?.email}
            <span>2주</span>
          </div>
          <div className="menu">
            <ThreeDotsIcon className="icon" />
          </div>
        </div>
        <div className="body">
          요즘 개발자들의 모습
          <br />
          <br />
          1. 자기관리 및 자기계발하는데 끊임없이 투자한다.
          <br />
          <br />
          2. 늘 항상 학습하는 습관이 갖춰져있다.
          <br />
          <br />
          3. 다른 여러 개발자들과 소통하는 것에 관심이 많다.
          <br />
          <br />
          4. 새로운 기술과 트렌드를 적용해보고 끊임 없이 탐구하려는 욕망이
          강하다.
          <br />
          <br />- [요즘 개발자] 라는 책을 읽고 나서 책의 내용을 토대로 요즘
          개발자의 모습이 어떤지 생각해 보았습니다.
        </div>
        <div className="post-footer">
          <div className="icons">
            <div className="likes-btn">
              <HeartIconOutline className="icon" />
              <span>31</span>
            </div>
            <div className="comments-btn">
              <ChatIcon className="icon" />
              <span>2</span>
            </div>
            <div className="reposts-btn">
              <RepostIcon className="icon" />
              <span>1</span>
            </div>
            <div className="send-btn">
              <SendIcon className="icon" />
              <span>1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
