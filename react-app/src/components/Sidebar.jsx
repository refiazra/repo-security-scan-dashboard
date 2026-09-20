import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const isRepoPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/repos") ||
    location.pathname.startsWith("/scans") ||
    location.pathname.startsWith("/findings");

  return (
    <aside className="sidebar">
      <div className="logo">SecScan</div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={isRepoPage ? "is-active" : ""}>
              Repositories
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-scan" className={({ isActive }) => (isActive ? "is-active" : "")}>
              New Scan
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={({ isActive }) => (isActive ? "is-active" : "")}>
              Scan History
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
