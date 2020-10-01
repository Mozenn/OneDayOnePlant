import React from "react";
import axios from "axios";
import Timer from "./Timer";
import history from "../history";
import styles from "./Generator.module.css";
import { HelpCircle } from "react-feather";

class Generator extends React.Component {
  state = {
    isReset: true,
    user: null,
    plant: null,
    remainingTime: "",
    loading: true,
  };

  async componentDidMount() {
    if (this.props.userId) {
      await this.initializeState();
    }
  }

  async componentDidUpdate() {
    if (this.state.loading) {
      await this.initializeState();
    }
  }

  async initializeState() {
    const result = await this.fetchUser();

    if (result.status !== 200 && result.status !== 201) {
      this.setState({ loading: false });
      if (result.status === 401) {
        this.props.onLogout();
        history.push("/");
        return;
      }

      console.log("User fetch Error");
      throw new Error("Failed to fetch user");
    }
    this.setState({
      user: result.data.user,
    });

    const cooldownBetweenDraw = 86400000; // 1 day in ms

    this.setState({
      isReset:
        new Date() - new Date(this.state.user.lastDrawDate) >
        cooldownBetweenDraw,
      loading: false,
    });
  }

  async fetchUser() {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/user/${this.props.userId}`,
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    }).catch((err) => {
      console.log(err.response);
      return err.response;
    });
  }

  fetchRandomPlant = async () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/draw`,
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((result) => {
        this.setState({ isReset: false, loading: true });
      })
      .catch((err) => {
        console.log(err.response);
        return err.response;
      });
  };

  renderName = () => {
    if (!this.state.isReset && this.state.user.lastDrawPlant !== undefined) {
      return (
        <p className={styles.name}>{this.state.user.lastDrawPlant.name}</p>
      );
    }
  };

  renderImage = () => {
    if (this.state.isReset || this.state.user.lastDrawPlant === undefined) {
      return <HelpCircle size={248} />;
    } else {
      return (
        <img
          src={this.state.user.lastDrawPlant.imgUrl}
          alt='last drawn plant'
        />
      );
    }
  };

  renderButtons = () => {
    if (this.state.isReset) {
      return (
        <button onClick={this.fetchRandomPlant} className={styles.button}>
          Collect
        </button>
      );
    } else if (this.state.user.lastDrawPlant !== undefined) {
      return (
        <>
          <Timer lastDrawDate={this.state.user.lastDrawDate} />
          <a
            href={this.state.user.lastDrawPlant.url}
            className={styles.secondaryButton}
          >
            Learn more
          </a>
        </>
      );
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <div className={styles.container}>
          <div className={styles.imageContainer}>{this.renderImage()}</div>
          {this.renderName()}
          {this.renderButtons()}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Generator;
