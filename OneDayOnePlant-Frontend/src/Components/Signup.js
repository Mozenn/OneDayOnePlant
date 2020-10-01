import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import styles from "./Form.module.css";
import history from "../history";
import {
  isEmailValid,
  isUsernameValid,
  isPasswordValid,
  AreFieldsValid,
} from "../utils/formValidation";

class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    usernameEnabled: false,
    emailEnabled: false,
    passwordEnabled: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: "" });

    const { email, username, password } = this.state;

    if (AreFieldsValid(username, email, password)) {
      let res;
      try {
        res = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}/signup`,
          data: {
            username,
            email,
            password,
          },
        });
      } catch (err) {
        if (err.response.data.message) {
          this.setState({ errorMessage: err.response.data.message });
        } else {
          this.setState({ errorMessage: "Sign up Error" });
        }
        return;
      }

      this.props.showToast(
        `an email has been sent to ${email} to verify your account and be able to log in`,
        "info"
      );
      this.props.closeModal();
      history.push("/");
    }
  };

  onUsernameChange = (event) => {
    if (!this.state.usernameEnabled) {
      this.setState({ usernameEnabled: true });
    }
    this.setState({ username: event.target.value });
  };

  onEmailChange = (event) => {
    if (!this.state.emailEnabled) {
      this.setState({ emailEnabled: true });
    }
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    if (!this.state.passwordEnabled) {
      this.setState({ passwordEnabled: true });
    }
    this.setState({ password: event.target.value });
  };

  render() {
    const {
      email,
      username,
      password,
      usernameEnabled,
      passwordEnabled,
      emailEnabled,
    } = this.state;

    return ReactDOM.createPortal(
      <div className={styles.modal}>
        <form onSubmit={this.onSubmit} className={styles.form}>
          <div className={styles.formElement}>
            <label className={styles.formElementLabel} htmlFor='username'>
              Username
            </label>
            <input
              className={
                !isUsernameValid(username) && usernameEnabled
                  ? styles.formElementInputError
                  : styles.formElementInput
              }
              type='text'
              id='username'
              onChange={this.onUsernameChange}
            ></input>
          </div>
          <div className={styles.formElement}>
            <label className={styles.formElementLabel} htmlFor='email'>
              Email
            </label>
            <input
              className={
                !isEmailValid(email) && emailEnabled
                  ? styles.formElementInputError
                  : styles.formElementInput
              }
              type='email'
              id='email'
              onChange={this.onEmailChange}
            ></input>
          </div>
          <div className={styles.formElement}>
            <label className={styles.formElementLabel} htmlFor='password'>
              Password
            </label>
            <input
              className={
                !isPasswordValid(password) && passwordEnabled
                  ? styles.formElementInputError
                  : styles.formElementInput
              }
              type='password'
              id='password'
              onChange={this.onPasswordChange}
            ></input>
          </div>
          <small className={styles.errorMessage}>
            {this.state.errorMessage}
          </small>
          <button
            disabled={!AreFieldsValid(username, email, password)}
            className={
              AreFieldsValid(username, email, password)
                ? styles.button
                : styles.disabledButton
            }
          >
            Sign up
          </button>
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

export default Signup;
