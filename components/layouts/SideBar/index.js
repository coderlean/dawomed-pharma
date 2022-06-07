import React from 'react';
import { iconsSVGs } from '../../../assets/images/icons';
import styles from "./styles/styles.module.css";

const SideBar = ({children, closeSideBar}) => {
    return (
        <div className={[styles.sidebarScreen, 'widthScreen heightScreen displayFlex jcEnd'].join(" ")}>
            <div className={[styles.sidebar, "displayFlex"].join(" ")}>
            <div className={styles.closeIcon} onClick={() => closeSideBar()}>
                {
                    iconsSVGs.closeIconWhite
                }
            </div>

            <div className={styles.sidebarContainer}>
                <header className='displayFlex jcSpaceBetween alignCenter pl20 pr20 pt10 pb10'>
                    {
                        children[0]
                    }

                    {
                        children[1]
                    }
                </header>

                <main>
                    {
                        children[2]
                    }

                    {
                        children[3]
                    }
                </main>
            </div>
        </div>
        </div>
    )
}

export default SideBar