import React, { useEffect, useRef, useState } from 'react';
import styles from 'assets/OrderDropDown.module.css'
import { FiArrowUp, FiChevronDown } from "react-icons/fi";
import { TagType, OrderType } from "types";
import { useRecoilState } from "recoil";
import {itemsState, tagsState} from "states";
import moment from "moment";

const dropDownItems = [
    {
        name: "시간순",
        engName: "time",
        value: 0
    },
    {
        name: "학점순",
        engName: "credit",
        value: 1
    },
    {
        name: "학년순",
        engName: "grade",
        value: 2
    }
]

const convertDay = ["일", "월", "화", "수", "목", "금", "토"]

const OrderDropDown = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState({ name: "", value: -1, order: "" });
    const [items, setItems] = useRecoilState(itemsState);

    const dropdownButtonRef = useRef(null);
    const dropdownRef = useRef(null);
    const dropdownItemRef = useRef([]);

    const [tags, setTags] = useRecoilState(tagsState);

    useEffect(() => {
        let newItems = [...items];
        const currentDate = moment();
        if(selected.name === 'time') {
            if(selected.order === OrderType.DESC) {
                newItems.sort((a,b) => {
                    const aDate = currentDate.startOf('week').add('days', convertDay.indexOf(a.day));
                    const aDateISOString = aDate.format().split("T")[0];
                    const bDate = currentDate.startOf('week').add('days', convertDay.indexOf(b.day));
                    const bDateISOString = bDate.format().split("T")[0];
                    const aTime = new Date(`${aDateISOString}T${a.startTime}:00`);
                    const bTime = new Date(`${bDateISOString}T${b.startTime}:00`);
                    return aTime>bTime ? -1 : aTime<bTime ? 1 : 0;
                })
            } else {
                newItems.sort((a,b) => {
                    const aDate = currentDate.startOf('week').add('days', convertDay.indexOf(a.day));
                    const aDateISOString = aDate.format().split("T")[0];
                    const bDate = currentDate.startOf('week').add('days', convertDay.indexOf(b.day));
                    const bDateISOString = bDate.format().split("T")[0];
                    const aTime = new Date(`${aDateISOString}T${a.startTime}:00`);
                    const bTime = new Date(`${bDateISOString}T${b.startTime}:00`);
                    return aTime>bTime ? 1 : aTime<bTime ? -1 : 0;
                })
            }
        } else if (selected.name === 'credit') {
            if(selected.order === OrderType.DESC) {
                newItems.sort((a,b) => {
                    return parseInt(a.hakjum) - parseInt(b.hakjum);
                })
            } else {
                newItems.sort((a,b) => {
                    return parseInt(b.hakjum) - parseInt(a.hakjum);
                })
            }
        } else if (selected.name === 'grade') {
            if(selected.order === OrderType.DESC) {
                newItems.sort((a,b) => {
                    return parseInt(a.haknean) - parseInt(b.haknean);
                })
            } else {
                newItems.sort((a,b) => {
                    return parseInt(b.haknean) - parseInt(a.haknean);
                })
            }
        }
        setItems(newItems);
    },[selected, JSON.stringify(items)])

    // dropdown 외부 클릭 시 닫히도록
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (dropdownButtonRef.current && dropdownButtonRef.current.contains(event.target)) {
                    return;
                }
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (open && selected.value !== -1) {
            dropdownItemRef.current[selected.value].className = styles.dropdownItemSelected;
        }
    }, [open]);

    useEffect(() => {
        if (selected.value !== -1) {
            let tempTags = [...tags];
            for (let i = 0; i < tempTags.length; i++) {
                if (tempTags[i].type === TagType.ORDER) {
                    tempTags.splice(i, 1);
                }
            }
            tempTags.push({
                type: TagType.ORDER,
                name: dropDownItems[selected.value].name,
                order: selected.order
            });
            tempTags.sort((a, b) => {
                return b.type.length - a.type.length;
            });
            setTags(tempTags);
        } else {
            let tempTags = [...tags];
            for (let i = 0; i < tempTags.length; i++) {
                if (tempTags[i].type === TagType.ORDER) {
                    tempTags.splice(i, 1);
                }
            }
            tempTags.sort((a, b) => {
                return b.type.length - a.type.length;
            });
            setTags(tempTags);
        }
    }, [selected]);

    return (
        <div>
            <div
                className={styles.container}
                ref={dropdownButtonRef}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <div style={{ marginRight: 6 }}>정렬</div>
                <FiChevronDown />
            </div>
            {
                open ? (
                    <div className={styles.dropdownContainer} ref={dropdownRef}>
                        <div className={styles.dropdownTitle}>정렬</div>

                        <div className={styles.dropdownItemContainer}>
                            {
                                dropDownItems.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.dropdownItem}
                                            onClick={(event) => {
                                                // 자신이 아닌 다른 아이템들의 style을 초기화
                                                dropdownItemRef.current.forEach((item) => {
                                                    if (item !== event.target) {
                                                        item.className = styles.dropdownItem;
                                                    }
                                                });

                                                if (selected.value === index) {
                                                    if (selected.order === OrderType.ASC) {
                                                        setSelected({ name: dropDownItems[index].engName, value: dropDownItems[index].value, order: OrderType.DESC });
                                                    } else if (selected.order === OrderType.DESC) {
                                                        setSelected({ name: "", value: -1, order: "" });
                                                    } else {
                                                        setSelected({ name: dropDownItems[index].engName, value: dropDownItems[index].value, order: OrderType.ASC });
                                                    }
                                                } else {
                                                    setSelected({ name: dropDownItems[index].engName, value: dropDownItems[index].value, order: OrderType.ASC });
                                                }
                                                dropdownItemRef.current[index].className = styles.dropdownItemSelected;
                                            }}
                                            onMouseOver={(event) => {
                                                dropdownItemRef.current.forEach((item) => {
                                                    if (item !== event.target) {
                                                        item.className = styles.dropdownItem;
                                                    }
                                                });
                                                dropdownItemRef.current[index].className = styles.dropdownItemHover;
                                            }}
                                            onMouseOut={() => {
                                                for (let i = 0; i < dropdownItemRef.current.length; i++) {
                                                    if (selected.value !== i) {
                                                        dropdownItemRef.current[i].className = styles.dropdownItem;
                                                    }
                                                }
                                                if (selected.value !== -1) {
                                                    dropdownItemRef.current[selected.value].className = styles.dropdownItemSelected;
                                                }
                                            }}
                                            ref={ref => dropdownItemRef.current[index] = ref}
                                        >
                                            <div>{item.name}</div>
                                            {(selected.name === item.engName && tags.length > 0 && tags[tags.length - 1].type === TagType.ORDER) && <FiArrowUp style={{ rotate: tags[tags.length - 1].order === OrderType.ASC ? "0deg" : "180deg", transition: "all 0.4s" }} />}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default OrderDropDown;
