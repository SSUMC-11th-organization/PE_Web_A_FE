import "./header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="UMCINE 홈">
          UMC<span>INE</span>
        </a>

        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="active" href="#movies">
            영화
          </a>
          <a href="#upcoming">개봉 예정</a>
          <a href="#bookmarks">북마크</a>
        </nav>

        <div className="header-actions">
          <button type="button" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button type="button" aria-label="내 프로필">
            <img src="/icons/person.svg" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}
