import React from "react";
import { SmoothCorners } from "react-smooth-corners";

const SmoothBorder = ({
    content,
    size = 50
}) => {
    return (
        <SmoothCorners
            corners="3"
            borderRadius="12px"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                background: '#252525',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffffff',
                position: "relative",
                zIndex: 999
            }}
        >
            <div>{content}</div>
        </SmoothCorners>
    );
};

export default SmoothBorder;
