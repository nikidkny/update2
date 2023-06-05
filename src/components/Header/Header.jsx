import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Header.scss";
import Line from "../Line/Line";

const Header = ({ className, theme }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
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
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/community">Community</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      )}
      {isLoginPage && (
        <nav>
          <Link to="/login">
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
};
Header.defaultProps = {
  theme: "light",
};
export default Header;
