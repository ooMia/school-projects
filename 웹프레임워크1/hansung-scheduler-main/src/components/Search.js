import React, { useRef } from 'react';
import { FiSearch } from "react-icons/fi";
import styles from "assets/Search.module.css";
import {useRecoilState} from "recoil";
import {itemsState} from "states";
import {StatusType} from "types";

const Search = () => {
    const inputRef = useRef("");
    const [items, setItems] = useRecoilState(itemsState);

    const handleSearch = () => {
        console.log(inputRef.current.value, items);
        let newItems = items.map((item) => {
            if(
                item.kwamokname.includes(inputRef.current.value) ||
                item.prof?.some((x) => x.includes(inputRef.current.value)) ||
                item.kwamokcode?.includes(inputRef.current.value) ||
                item.isugubun?.includes(inputRef.current.value) ||
                item.juya?.includes(inputRef.current.value) ||
                item.classroom?.includes(inputRef.current.value) ||
                item.startTime?.includes(inputRef.current.value) ||
                item.endTime?.includes(inputRef.current.value) ||
                item.day?.includes(inputRef.current.value) ||
                item.bunban?.includes(inputRef.current.value)
            ) {
                return {
                    ...item,
                    status: StatusType.SHOWEN
                }
            } else {
                return {
                    ...item,
                    status: StatusType.HIDDEN
                }
            }
        })
        setItems(newItems);
    }

    return (
        <div className={styles.container}>
            <input
                ref={inputRef}
                type={"text"}
                className={styles.input}
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        handleSearch();
                    }
                }}
            />

            <FiSearch size={24} color={"#252525"} onClick={handleSearch} />
        </div>
    );
};

export default Search;