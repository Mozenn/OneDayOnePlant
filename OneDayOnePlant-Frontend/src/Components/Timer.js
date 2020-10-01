import React from "react";
import styles from "./Generator.module.css";
import { millisecondsToTime } from "../utils/timeUtil";

class Timer extends React.Component {
  state = { remainingTime: "" };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        remainingTime: millisecondsToTime(
          86400000 - (new Date() - new Date(this.props.lastDrawDate))
        ),
      });
    }, 500);
  }

  render() {
    return (
      <button className={styles.disabledButton}>
        {this.state.remainingTime}
      </button>
    );
  }
}

export default Timer;
