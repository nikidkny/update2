import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Header.scss";
import Line from "../Line/Line";

const Header = ({ className, theme, currentPage }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  var classes = classNames([className, "header", `header-${theme}`]);
  return (
    <header className={classes}>
      {!isLoginPage && (
        <nav>
          <Link to="/profile">
            <Logo></Logo>
          </Link>
          <ul>
            <li>
              <Link to="/courses" className={currentPage === "courses" ? "active" : ""}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/forum" className={currentPage === "forum" ? "active" : ""}>
                Forum
              </Link>
            </li>
            <li>
              <Link to="/profile" className={currentPage === "profile" ? "active" : ""}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      )}
      {isLoginPage && (
        <nav>
          <Link to="/">
            <Logo></Logo>
          </Link>
        </nav>
      )}
      <Line />
    </header>
  );
};
Header.PropType = {
  theme: PropTypes.oneOf(["light", "dark"]),
  currentPage: PropTypes.string.isRequired,
};
Header.defaultProps = {
  theme: "light",
};
export default Header;
