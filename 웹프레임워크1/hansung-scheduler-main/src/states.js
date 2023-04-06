import { atom } from "recoil";
import data from "data.json";
import {StatusType} from "types";
import {reactLocalStorage} from 'reactjs-localstorage';

const dataHandling = (key) => {
    const savedValue = reactLocalStorage.get(key);
    if (savedValue !== undefined) {
        return savedValue;
    } else {
        const _data = JSON.parse(JSON.stringify(data)).data;
        return _data.map(data => {return {...data, status: StatusType.SHOWEN}});
    }
}

const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = reactLocalStorage.get(key)
    if (savedValue !== undefined) {
        setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
        isReset
            ? reactLocalStorage.remove(key)
            : reactLocalStorage.set(key, JSON.stringify(newValue));
    });
};

export const tagsState = atom({
    key: 'tagsState',
    default: []
});

export const itemsState = atom({
    key: 'itemsState',
    default: dataHandling('schedules'),
    effects: [
        localStorageEffect('schedules'),
    ]
});