import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import BulletPoint from "./BulletPoint";

const Home = ({ isSignedIn }) => {
  const word = isSignedIn ? "Continue" : "Start";

  const renderButton = () => {
    if (isSignedIn) {
      return (
        <Link
          to='/collect'
          className={styles.button}
        >{`${word} your learning journey`}</Link>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Learn about flora in a fun way</h2>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.firstRow}>
          <BulletPoint
            className={styles.bulletPoint}
            text='Collect one plant per day'
          />
          <BulletPoint className={styles.bulletPoint} text='Learn about it' />
        </div>
        <BulletPoint className={styles.bulletPoint} text='Grow your tree' />
      </div>
      {renderButton()}
      <footer className={styles.footer}>
        <span></span>
        <p>
          Made by <a href='https://twitter.com/GCassany'>Cassany Gauthier</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
