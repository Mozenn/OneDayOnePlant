import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/Logo.png";
import styles from "./Header.module.css";
import Login from "./Login";
import Signup from "./Signup";

class Header extends React.Component {
  state = { showLoginModal: false, showSignupModal: false };

  onLoginClicked = () => {
    this.setState({ showLoginModal: true });
  };

  onSignupClicked = () => {
    this.setState({ showSignupModal: true });
  };

  closeLoginModal = () => {
    this.setState({ showLoginModal: false });
  };

  closeSignupModal = () => {
    this.setState({ showSignupModal: false });
  };

  renderModal = () => {
    if (this.state.showLoginModal) {
      return (
        <Login
          setUserId={this.props.setUserId}
          setSignedIn={this.props.setSignedIn}
          setToken={this.props.setToken}
          closeModal={this.closeLoginModal}
        />
      );
    } else if (this.state.showSignupModal) {
      return (
        <Signup
          setUserId={this.props.setUserId}
          setSignedIn={this.props.setSignedIn}
          setToken={this.props.setToken}
          closeModal={this.closeSignupModal}
          showToast={this.props.showToast}
        />
      );
    }
  };

  renderButtons = () => {
    if (this.props.isSignedIn) {
      return (
        <>
          <div className={styles.buttonContainer}>
            <Link to='/collect' className={styles.button}>
              Collect
            </Link>
            <Link to='/profile' className={styles.button}>
              Profile
            </Link>
            <Link
              to='/'
              onClick={this.props.onLogout}
              className={styles.button}
            >
              Log out
            </Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.buttonContainer}>
            <button onClick={this.onLoginClicked} className={styles.button}>
              Log in
            </button>
            <button onClick={this.onSignupClicked} className={styles.button}>
              Sign up
            </button>
          </div>
          {this.renderModal()}
        </>
      );
    }
  };

  render() {
    return (
      <header className={styles.container}>
        <Link to='/'>
          <img className={styles.logo} src={logo} alt='logo' />
        </Link>
        <Link to='/' className={styles.titleLink}>
          <h1 className={styles.title}>One Day, One Plant</h1>
        </Link>
        {this.renderButtons()}
      </header>
    );
  }
}

export default Header;
