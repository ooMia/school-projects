import React from 'react';
import { Text } from "@nextui-org/react";

import SmoothBorder from "components/SmoothBorder";
import styles from "assets/Header.module.css";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.gnbMenuLeft}>
                <a className={styles.title}>
                    <Text
                        h1
                        size={50}
                        css={{
                            textGradient: "90deg, $blue500 -20%, $pink500 50%",
                            marginLeft: "30px",
                            position: "relative",
                            zIndex: 999
                        }}
                    >
                        효율
                    </Text>
                </a>
            </div>
        </div>
    );
};

export default Header;