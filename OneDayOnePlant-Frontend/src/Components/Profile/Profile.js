import React from "react";
import axios from "axios";
import Collection from "./Collection";
import styles from "./Profile.module.css";
import history from "../../history";

class Profile extends React.Component {
  state = { score: 0, plants: [], plantsTotal: 0, loading: true };

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

    const plantsResult = await this.fetchPlants();

    if (plantsResult.status !== 200 && plantsResult.status !== 201) {
      this.setState({ loading: false });

      if (plantsResult.status === 401) {
        this.props.onLogout();
        history.push("/");
        return;
      }
      console.log("Plants fetch Error");
      throw new Error("Failed to fetch plants");
    }

    this.setState({
      score: result.data.user.score,
      plants: result.data.user.plants,
      plantsTotal: plantsResult.data.plants.length,
      loading: false,
    });
  }

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

  async fetchPlants() {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/plants`,
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    }).catch((err) => {
      console.log(err.response);
      return err.response;
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <div className={styles.container}>
          <div className={styles.score}>
            <p>Your Score</p>
            <p>{`${this.state.score} / ${this.state.plantsTotal}`}</p>
          </div>
          <Collection plants={this.state.plants} />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Profile;
