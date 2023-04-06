import React, { useEffect, useState } from 'react';
import Search from "components/Search";
import TagGroup from "components/TagGroup";
import OrderDropDown from "components/OrderDropDown";
import FilterDropDown from "components/FilterDropDown";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {itemsState, tagsState} from "states";

import styles from "assets/Main.module.css";
import CardGrid from "components/CardGrid";
import MyScheduler from 'components/MyScheduler';
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {StatusType} from "types";
import ScheduleIcon from "components/ScheduleIcon";

const Main = () => {
    const [activeId, setActiveId] = useState(null);
    const [items, setItems] = useRecoilState(itemsState);
    const tags = useRecoilValue(tagsState);

    useEffect(() => {
        console.log(tags);
    }, [tags]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const { active, over } = event;

        if (active !== over) {
            console.log(active, over)
            if(over.id === 'schedule' || over.id === 'schedule_icon'){
                setItems(prev => {
                    return prev.map(item => {
                        if(active.id === item.id){
                            console.log("here");
                            return {
                                ...item,
                                status: StatusType.DRAGGED
                            }
                        } else {
                            return item;
                        }
                    })
                })
            } else {
                setItems((items) => {
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over.id);

                    return arrayMove(items, oldIndex, newIndex);
                });
            }
            console.log("items", items);

        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className={styles.container}>
                <div className={styles.calenderContainer}>
                    <MyScheduler />
                </div>

                <div className={styles.bottomContainer}>
                    <div className={styles.filterContainer}>
                        <Search />

                        <div className={styles.dropdownContainer}>
                            <OrderDropDown />
                            <FilterDropDown />
                        </div>
                    </div>

                    <div className={styles.tagContainer}>
                        <TagGroup tags={tags} />
                    </div>

                    <CardGrid />

                    <ScheduleIcon/>
                </div>
            </div>
        </DndContext>
    );
};

export default Main;