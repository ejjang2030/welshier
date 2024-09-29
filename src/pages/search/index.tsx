import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {GoSearch as SearchIcon} from "react-icons/go";

import "./Search.module.scss";
import {Post, UserData} from "types";
import {
  collection,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {db} from "firebaseApp";
import SearchedUserItem from "components/users/SearchedUserItem";
import PostBox from "components/posts/PostBox";
import {useTranslation} from "react-i18next";

type SearchTab = "users" | "hashtags";

const SearchPage = () => {
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<UserData[]>([]);
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [currTab, setCurrTab] = useState<SearchTab>("users");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: {value},
    } = e;
    setSearchText(value);
  };

  const getTabClass = useCallback(
    (tabName: SearchTab) => {
      if (currTab === tabName) return "search__tabs-tab active";
      else return "search__tabs-tab";
    },
    [currTab]
  );

  useEffect(() => {
    setSearchedUsers([]);
    setSearchedPosts([]);
    if (searchText) {
      const searchedUsersRef = collection(db, "users");

      // 사용자 검색 결과 목록 조회
      onSnapshot(searchedUsersRef, snapshot => {
        snapshot.docs.forEach(doc => {
          let data = doc.data() as UserData;
          if (
            data.userId.includes(searchText) ||
            data.name.includes(searchText) ||
            data.email.includes(searchText) ||
            data.introduction.includes(searchText)
          ) {
            setSearchedUsers(prev =>
              prev ? [...Array.from(new Set([...prev, data]))] : []
            );
          }
        });
      });

      // 해시태그로 검색된 게시글 목록 조회
      const searchedPostsRef = collection(db, "posts");
      const searchedPostsByHashtagsQuery = query(
        searchedPostsRef,
        where("hashtags", "array-contains-any", [searchText]),
        orderBy("createdAt", "desc")
      );
      onSnapshot(searchedPostsByHashtagsQuery, snapshot => {
        snapshot.docs.map(doc => {
          setSearchedPosts(prev =>
            prev ? [...prev, {...(doc.data() as Post), id: doc.id}] : []
          );
        });
      });
    }
  }, [searchText]);

  useEffect(() => {
    console.log(t("search"));
  }, [t]);

  return (
    <div className='search'>
      <div className='search__appbar'>
        <div className='search__appbar-text'>
          <span>{t("search")}</span>
        </div>
        <div className='search__appbar-input'>
          <SearchIcon className='icon' />
          <input
            type='text'
            value={searchText}
            placeholder={t("search")}
            onChange={handleOnChange}
          />
        </div>
      </div>
      {searchText && (
        <div className='search__tabs'>
          <div
            className={getTabClass("users")}
            onClick={() => setCurrTab("users")}>
            사용자
          </div>
          <div
            className={getTabClass("hashtags")}
            onClick={() => setCurrTab("hashtags")}>
            해시태그
          </div>
        </div>
      )}
      <div className='search__body'>
        {currTab === "users" &&
          searchedUsers &&
          searchedUsers.length > 0 &&
          searchedUsers.map((userData, index) => (
            <SearchedUserItem
              key={`${index}`}
              userData={userData}
            />
          ))}
        {currTab === "hashtags" &&
          searchedPosts &&
          searchedPosts.length > 0 &&
          searchedPosts.map((post, index) => (
            <PostBox
              key={`${index}`}
              post={post}
            />
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
