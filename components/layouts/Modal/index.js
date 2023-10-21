import React from 'react';
import styles from './styles/styles.module.css';

const Modal = ({children}) => {
    console.log({children});
    return (
        <div className={styles.modal}>
            {children}
        </div>
    )
}

export default Modal