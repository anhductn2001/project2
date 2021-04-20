/**
 * App Storage class
 * @description This will be responsible for storing data into the application.
 * Commonly, people use LocalStorage or SessionStorage. This is just a wrapper over them
 * because to restrict the usage of Global window storage throughtout the application
 * Default, this is just using the LocalStorage
 */
export class AppStorage {
    constructor(storage) {
        this.storage = storage || window.localStorage;

        /** Is storage is supported or not */
        if (!this.isSupported()) {
            throw new Error('Storage is not supported by browser!');
        }
    }

    setItem(key, value) {
        let val = value;
        if (typeof value === 'object') {
            val = JSON.stringify(value);
        }
        this.storage.setItem(key, val);
    }

    getItem(key) {
        const val = this.storage.getItem(key);
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }

    removeItem(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    /**
     * @description Check for storage support
     * @returns {boolean} supported
     * */
    isSupported() {
        let supported = true;

        if (!this.storage) {
           supported = false;
        }

        return supported;
    }
}

/**
 * Creating the instance of storage. Default will be localStorage
 * but if you want to create instance for session storage then pass window.sessionStorage as parameter
 */
const localStorage = new AppStorage(window.localStorage);
// const sessionStorage = new AppStorage(window.sessionStorage);

export default localStorage;
