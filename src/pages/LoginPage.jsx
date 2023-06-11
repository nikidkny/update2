import React, { useContext, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import BackgroundVideo from "../components/BackgroundVideo";
import LoginButton from "../components/LoginButton/LoginButton";

const LoginPage = ({ className, buttonLabel }) => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleSignIn = () => {
    handleLogin(email, password)
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        console.error("Login error:", error.message);
      });
  };
  // const handleKeyDown = () => {
  //   handleSignIn();
  // };
  var classes = classNames([className, "login"]);

  return (
    <>
      <Header theme="dark" />
      <div className={classes}>
        <BackgroundVideo />
        <div className="form">
          <h2>Login</h2>
          <input type="email" value={email} onChange={handleEmailChange} />
          <input type="password" value={password} onChange={handlePasswordChange} />
          <LoginButton
            buttonLabel={buttonLabel}
            onClick={handleSignIn}
            // onKeyPress={handleKeyDown}
          />
        </div>
      </div>
    </>
  );
};

LoginPage.propTypes = {
  className: PropTypes.string,
  buttonLabel: PropTypes.string,
};

LoginPage.defaultProps = {
  className: "",
  buttonLabel: "Sign in",
};

export default LoginPage;
