import React from 'react';
import {
    rectSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';
import { SortableItem } from 'components/SortableItem';

import styles from "assets/CardGrid.module.css";
import { itemsState } from "states";
import { useRecoilValue } from "recoil";
import { StatusType } from "types";

import { FixedSizeGrid } from "react-window";

const CardGrid = () => {

    const items = useRecoilValue(itemsState);


    return (

        <div className={styles.container}>
            <SortableContext
                items={items}
                strategy={rectSortingStrategy}
            >
                
                {
                    items.map((item) => {
                        if (item.status === StatusType.SHOWEN) {
                            return (
                                <SortableItem
                                    key={`item-${item.id}`}
                                    id={item.id}
                                    item={item}
                                />
                            )
                        } else {
                            return null;
                        }
                    })
                }
            </SortableContext>
        </div>

    );
}

const CardTable = () => {
    const dataList = useRecoilValue(itemsState);

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div style={{ ...style, ...{ display: "flex", whiteSpace: "pre-wrap" } }}>
            <img
                src={dataList[rowIndex * 4 + columnIndex].avatar}
                alt={dataList[rowIndex * 4 + columnIndex].name}
                width={50}
            />
            <p>{dataList[rowIndex * 4 + columnIndex].name} - {dataList[rowIndex * 4 + columnIndex].email}</p>
        </div>
    );

    return (
        <FixedSizeGrid
            height={(window.innerHeight - 20)}
            width={(window.innerWidth - 20)}
            columnCount={4}
            rowCount={dataList.length}
            columnWidth={(window.innerHeight) / 2}
            rowHeight={80}
        >
            {Cell}
        </FixedSizeGrid >
    );
}

export default CardGrid;