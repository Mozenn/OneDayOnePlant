import React from 'react' ; 
import styles from './Collection.module.css' ; 

const CollectionElement = ({name, url}) => {

  return (
    <div className={styles.element}>
      <p>{name}</p>
      <a href={url}>Learn more</a>
    </div>
  )
} ; 

export default CollectionElement ; 