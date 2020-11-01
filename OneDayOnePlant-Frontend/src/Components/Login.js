import React from "react";
import ReactDOM from "react-dom";
import styles from "./Form.module.css";
import history from "../history";
import axios from "axios";

class Login extends React.Component {
  state = { username: "", password: "", errorMessage: "" };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: "" });
    const { username, password } = this.state;
    let res;

    try {
      res = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/login`,
        data: {
          username,
          password,
        },
      });
    } catch (err) {
      if (err.response.data.? message) {
        this.setState({ errorMessage: err.response.data.message });
      } else {
        this.setState({ errorMessage: "Login Error" });
      }
      return;
    }

    const { token, userId } = res.data;

    this.props.setSignedIn(true);
    this.props.setUserId(userId);
    this.props.setToken(token);
    this.props.closeModal();
    history.push("/profile");
  };

  onUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    return ReactDOM.createPortal(
      <div className={styles.modal}>
        <form onSubmit={this.onSubmit} className={styles.form}>
          <div className={styles.formElement}>
            <label className={styles.formElementLabel} htmlFor='username'>
              Username
            </label>
            <input
              className={styles.formElementInput}
              type='text'
              id='username'
              onChange={this.onUsernameChange}
            ></input>
          </div>
          <div className={styles.formElement}>
            <label className={styles.formElementLabel} htmlFor='password'>
              Password
            </label>
            <input
              className={styles.formElementInput}
              type='password'
              id='password'
              onChange={this.onPasswordChange}
            ></input>
          </div>
          <small className={styles.errorMessage}>
            {this.state.errorMessage}
          </small>
          <button className={styles.button}>Log in</button>
          <button
            onClick={this.props.closeModal}
            className={(styles.button, styles.cancelButton)}
          >
            Cancel
          </button>
        </form>
      </div>,
      document.querySelector("#modal")
    );
  }
}

export default Login;
