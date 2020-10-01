import React from 'react' ; 
import styles from './BulletPoint.module.css' ; 
import icon from '../img/diamond.svg'; 


const BulletPoint = ({text}) => {

  return (
    <div className={styles.container}>
      <img src={icon} alt="icon"/>
      <p>{text}</p>
    </div>
  )
}

export default BulletPoint ; 