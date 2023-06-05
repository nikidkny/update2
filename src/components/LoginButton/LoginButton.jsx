import PropTypes from "prop-types";
import classNames from "classnames";
import "./LoginButton.scss";

const LoginButton = ({ className, buttonLabel, onClick }) => {
  var classes = classNames([className, "button"]);
  return (
    <button type="button" className={classes} onClick={onClick}>
      {buttonLabel}
    </button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

LoginButton.defaultProps = {
  className: "",
  buttonLabel: "Button",
};

export default LoginButton;
