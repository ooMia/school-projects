import React, { useState } from 'react';
import ReactCardFlip from "react-card-flip";
import { IoMenu } from 'react-icons/io5';
import TagGroup from "components/TagGroup";
import Moment from "react-moment";
import { useSwipeable } from 'react-swipeable';
import { confirmAlert } from "react-confirm-alert";

import styles from "assets/Card.module.css";
import { TagType } from "types";
import Modal from "components/Modal";
import { bunbanColor } from "utils";

/**
 *
 * @param   {string} title 제목
 * @param   {string} className 분반
 * @param   {string[]} tags 태그(학점 등)
 * @param   {string} professor 교수명
 * @param   {string} classroom 강의실 ex) 공학관 309
 * @param   {Date} startTime 시작 시간 (날짜는 상관없고 시간만 이용)
 * @param   {Date} endTime 끝 시간 (날짜는 상관없고 시간만 이용)
 */

const TimeContent = ({ day, startTime, endTime }) => {
    return (
        <div>
            {day}
            <Moment format={" HH:mm "} date={startTime} />
            ~
            <Moment format={" HH:mm"} date={endTime} />
        </div>

    )
}

const Card = ({ item, attributes, listeners }) => {
    const [flipped, setFlipped] = useState(false);
    const handlers = useSwipeable({
        onSwiped: (eventData) => setFlipped(prev => !prev),
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    const handleModalOpen = (item) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Modal onClose={onClose} item={item} />
                );
            }
        })
    }

    return (
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
            <div
                {...handlers}
                className={`${styles.card} ${styles.frontContainer}`}
                style={{ borderColor: bunbanColor[item.bunban] }}
                onClick={() => handleModalOpen(item)}
            >
                <div className={styles.cardBackground} style={{ color: bunbanColor[item.bunban] }}>{item.bunban}</div>
                <IoMenu className={styles.icon} size={"1.5em"} color={"lightgrey"} {...attributes} {...listeners} />

                <div className={styles.title}>{item.kwamokname}</div>
                <div className={styles.tagContainer}>
                    <TagGroup tags={[`${item.haknean}학년`, `${item.hakjum}학점`, item.juya].map(tag => ({ type: TagType.TAG, name: tag }))} />
                </div>
                <div className={styles.contentFont}>{item.prof.join(", ")}</div>
                <div className={styles.contentFont}>{item.classroom}</div>
                <div className={styles.contentFont} style={{ display: "flex", flexDirection: "row" }}>
                    <TimeContent
                        day={item.day}
                        startTime={new Date(`2022-01-01T${item.startTime}:00`)}
                        endTime={new Date(`2022-01-01T${item.endTime}:00`)}
                    />
                    <div style={{ display: "flex", flexDirection: "row", position: "relative", zIndex: 999 }}>
                        { item.online && <div>&nbsp;/&nbsp;</div> }
                        { item.online && <div style={{ color: "black", mixBlendMode: "difference" }}>{item.online}</div> }
                    </div>
                </div>

            </div>
            <div
                {...handlers}
                className={`${styles.card} ${styles.backContainer}`}
            >
                {item.kcomment}
            </div>
        </ReactCardFlip>

    )
}

export default Card;