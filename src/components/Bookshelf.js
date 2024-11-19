import React from "react";
import "./css/Bookshelf.css";

function Books(props) {
  return (
    <li className="booklist">
      <a href={props.href}>
        <img className="booksImg" src={props.src} alt={props.bookName} />
      </a>
    </li>
  );
}

function Yet() {
  return <li className="yet" />;
}

export default function Bookshelf() {
  return (
    <div>
      <div className="menu">
        <p className="pageName">내 서재</p>
        <p className="logOut">로그아웃</p>
        <ul className="bookStorage1">

            <Books
              src="/cover1.png"
              href="/Learning"
            />
          <Books
            src="/cover2.png"
            href="/Learning" 
            />
          <Books
            src="/cover3.png"
            href="/Learning"
            />
          <Books
            src="/cover4.png"
            href="/Learning"
            />
        </ul>
        <ul className="bookStorage2">
          <Yet />
          <Yet />
          <Yet />
          <Yet />
        </ul>
      </div>
    </div>
  );
}
