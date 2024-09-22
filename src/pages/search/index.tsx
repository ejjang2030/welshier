import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {GoSearch as SearchIcon} from "react-icons/go";

import "./Search.module.scss";
import {UserData} from "types";
import {collection, onSnapshot, or, query, where} from "firebase/firestore";
import {db} from "firebaseApp";
import SearchedUserItem from "components/users/SearchedUserItem";

type SearchTab = "users" | "hashtags";

const SearchPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<UserData[]>([]);
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
    if (searchText) {
      const searchedUsersRef = collection(db, "users");
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
    }
  }, [searchText]);

  return (
    <div className='search'>
      <div className='search__appbar'>
        <div className='search__appbar-text'>
          <span>검색</span>
        </div>
        <div className='search__appbar-input'>
          <SearchIcon className='icon' />
          <input
            type='text'
            value={searchText}
            placeholder='검색'
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
      </div>
    </div>
  );
};

export default SearchPage;
