import { defineStore, createPinia, mapState, mapActions } from 'pinia';

// Хранилище глобального состояния
const createGlobalState = defineStore('globalState', {
    state() {
        return {

        };
    },
    getters: {

    },
    actions: {

    }
});

// Получить объект стора через useGlobalStore() можно только после того,
// как отработает createApp(...).use(createPinia). Поэтому нужна предварительная
// инициализация стора, прежде чем будем в него что-то писать или получать
let globalState;

const getGlobalState = () => {

    if (!globalState) {
        globalState = createGlobalState();
    }
    return globalState;
}

// Получаем данные из глобального состояния
// Они не реактивные. Для реактивности нужно использовать
// useGlobalState в computed
const get = (key) => {
    const state = getGlobalState();
    return getNestedValue(state, key);
}

// Реактивность для computed
const useGlobalState = (params) => {
    return mapState(createGlobalState, params);
};

// actions
const useGlobalActions = (params) => {
    return mapActions(createGlobalState, params);
};

// Сохраняем данные в глобальный стор
const set = (data) => {

    let globalState = getGlobalState();

    globalState.$patch((state) => {

        for (const [ key, value ] of Object.entries(data)) {

            if (!key) {
                continue;
            }

            prepareForUpdate(state, key, value); // todo rename
            // const {preparedKey, preparedValue} = prepareForUpdate(state, key, value);

            // Я хотел сохранять через state[preparedKey],
            // но реактивность не срабатывает, потому что свойства
            // не были объявлены заранее.
            // Так что возможная оптимизация — объявить их заранее
            // globalState[preparedKey] = preparedValue;

            // Вот этот код должен работать реактивно, но по какой-то
            // причине он пока не работает реактивно, если заранее не были
            // объявлены свойства в state.
            // Странно, что операция со стором не заносит ничего в стейт.
            // Поэтому мне приходится еще делать так
            // state[preparedKey] = preparedValue;
        }
    });
};

const del = (keys) => {

    let globalState = getGlobalState();
    globalState.$patch((state) => {

        for (const key of keys) {

            if (!key.includes('.')) {

                delete state[key];
                continue;
            }

            const path = key.split('.');

            delete state[path[0]][path[1]];

        }

    });

};

// Этот метод используется для того, чтобы было удобно сохранять
// данные в сторе через точку notification.count = 1
// Это удобно, если notification — объект с несколькими свойствами,
// а нам нужно обновить только одно из свойств и пересохранить
const prepareForUpdate = (store, key, value) => { // todo change name

    if (!key.includes('.')) {
        store[key] = value;
    }

    const keys = key.split(/\./g);

    for (let i = 0; i < keys.length - 1; i++) {

        let k = keys[i];

        // Ошибка в пути
        if (!(k in store)) {
            throw new Error(`Ошибка в пути ${k}`);
        }

        store = store[k];
    }

    store[keys[keys.length - 1]] = value;
};

// Сахар: getNestedValue(myObj, 'hello.world.bla')
// равносильно myObj.hello.world.bla cо всеми проверками на наличие
const getNestedValue = (res, key) => {
    const keys = key.includes('.') ? key.split(/\./g) : [ key ];

    for (let i = 0; i < keys.length - 1; i++) {

        let k = keys[i];

        // Ошибка в пути
        if (!(k in res)) {
            return null;
        }

        res = res[k];
    }

    return res[keys[keys.length - 1]];
}

const initGlobalState = () => {
    if (import.meta.env.DEV) {
        console.log('todo сходить на сервер за данными');
        return;
    }
    const config = {}
    try {
        Object.assign(config, JSON.parse(window.CONFIG));
    } catch (e) {
        console.error('config not json');
    }
    set({ config });
};

const reset = () => {

    set({
        config: {},
        session: {}
    });
    setLocalStorage({});
};

const LOCAL_STORAGE_KEY = '__store';

const getLocalStorageData = () => {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
};

const setLocalStorage = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
};

const importLocalStorage = () => {
    set({ 'config.credentials': getLocalStorageData() });
};

export default {
    initGlobalState,
    createPinia,
    useGlobalState,
    get,
    set,
    useGlobalActions,
    reset,
    importLocalStorage,
    setLocalStorage
};