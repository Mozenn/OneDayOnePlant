import React from "react";
import { Router, Route } from "react-router-dom";
import history from "./history";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Profile from "./Components/Profile/Profile";
import Generator from "./Components/Generator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
  state = { isSignedIn: false, userId: null, token: null };

  setUserId = (newUserId) => {
    this.setState({ userId: newUserId });
    localStorage.setItem("userId", this.state.userId);
  };

  setSignedIn = (isSignedIn) => {
    this.setState({ isSignedIn: isSignedIn });
  };

  setToken = (token) => {
    this.setState({ token: token });
    localStorage.setItem("token", this.state.token);
  };

  onLogout = () => {
    this.setState({ isSignedIn: false, userId: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  showToast = (message, type) => {
    switch (type) {
      case "error":
        toast.error(message, { position: toast.POSITION.BOTTOM_RIGHT });
        break;
      case "info":
        toast.info(message, { position: toast.POSITION.BOTTOM_RIGHT });
        break;
    }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const userId = localStorage.getItem("userId");

    this.setState({ isSignedIn: true, userId, token });
  }

  render() {
    return (
      <>
        <Router history={history}>
          <div>
            <Header
              isSignedIn={this.state.isSignedIn}
              setUserId={this.setUserId}
              setSignedIn={this.setSignedIn}
              setToken={this.setToken}
              onLogout={this.onLogout}
              showToast={this.showToast}
            />
            <Route
              path='/'
              exact
              render={(props) => (
                <>
                  <Home {...props} isSignedIn={this.state.isSignedIn} />
                  <ToastContainer autoClose={false} />
                </>
              )}
            />
            <Route
              path='/profile'
              render={(props) => (
                <Profile
                  {...props}
                  userId={this.state.userId}
                  token={this.state.token}
                  onLogout={this.onLogout}
                />
              )}
            />
            <Route
              path='/collect'
              render={(props) => (
                <Generator
                  {...props}
                  userId={this.state.userId}
                  token={this.state.token}
                  onLogout={this.onLogout}
                />
              )}
            />
          </div>
        </Router>
      </>
    );
  }
}

export default App;
