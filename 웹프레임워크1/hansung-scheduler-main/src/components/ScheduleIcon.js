import {IoCalendarOutline} from "react-icons/io5";
import {useDroppable} from "@dnd-kit/core";
import styles from "assets/Main.module.css";
import {SmoothCorners, SmoothCornersWrapper} from "react-smooth-corners";
import React from "react";

const ScheduleIcon = ({id}) => {
    const {isOver, setNodeRef} = useDroppable({
        id: id ?? "schedule_icon",
    });

    const style = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: isOver ? "100" : "auto",
        opacity: isOver ? 0.5 : 1,
    };

    return (
        <SmoothCornersWrapper
            shadow="4px 0 10px rgb(0, 0, 0, 0.4)"
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}
        >
            <SmoothCorners
                corners="3"
                borderRadius="12px"
                className={styles.iconContainer}
            >
                <div
                    style={style}
                    ref={setNodeRef}
                    onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}
                >
                    <IoCalendarOutline className={styles.icon} />
                </div>
            </SmoothCorners>
        </SmoothCornersWrapper>
    )
}

export default ScheduleIcon;