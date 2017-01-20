export default class Events {

    constructor(parent) {
        this.parent = parent || this;
        this.map = {};
        this.mapOnce = {};
        this.mapAlias = {};
    }

    /**
     * Добавить callback на событие event, срабатывает каждый раз
     * @param event string Имя события
     * @param callback function Фунция обработчик
     * @param alias string Внутреннее имя для управления обработчиками
     */
    bind (event, callback, alias) {
        if (typeof callback !== 'function') return;
        this.map[event] ? this.map[event].push(callback) : this.map[event] = [callback];
        alias ? this.mapAlias[alias] = callback : null;
    }

    /**
     * Добавить callback на событие event, срабатывает только один раз
     * @param event string Имя события
     * @param callback function Фунция обработчик
     * @param alias string Внутреннее имя для управления обработчиками
     */
    bindOnce (event, callback, alias) {
        if (typeof callback !== 'function') return;
        this.mapOnce[event] ? this.mapOnce[event].push(callback) : this.mapOnce[event] = [callback];
        alias ? this.mapAlias[alias] = callback : null;
    }

    /**
     * Удалить все обработчики события
     * @param event
     */
    clear (event) {
        this.map[event] = this.mapOnce[event] = [];
    }

    /**
     * Удалить конкретный обработчик события, возможно импользовать имя
     * если оно было задано при установке обработчика или передать ссыллку на сам
     * обработчик
     * @param event
     * @param callback
     */
    removeHandler (event, callback) {
        let remCb = typeof callback == 'function' ? callback : this.mapAlias[callback];
        this.map[event] && remCb ? this.map[event] = this.map[event].filter(function(cb) {
                return cb != remCb
            }) : null;
        this.mapOnce[event] && remCb ? this.mapOnce[event] = this.mapOnce[event].filter(function(cb) {
                return cb != remCb
            }) : null;
    }

    /**
     * Запустить событие
     * @param event string Имя события
     * @param data mixed Данные для передачи обработчикам
     * @returns {Promise} Возвращает Promise который сработает после всех обработчиков
     */
    fire (event, data) {
        const events = this;
        let ev = events.map[event] || [],
            evOnce = events.mapOnce[event] || [],
            resultPromises = [];

        for (let i = 0, len = ev.length; i < len; i++) {
            resultPromises.push(events.call(ev[i], data));
        }
        while (evOnce.length > 0) resultPromises.push(events.call(evOnce.shift(), data));
        let resultPromise = Promise.all(resultPromises);

        this.fire('fire', [event, resultPromise]);

        return resultPromise;
    }

    /**
     * Внутренний метод для запуска обработчиков
     * @param callback
     * @param data
     */
    call (callback, data) {
        const events = this;
        return new Promise(function(resolv, reject) {
            try {
                resolv(callback.call(events.parent, data ? data : null));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Назначить родителя обработчикам
     * @param parent
     */
    setParent (parent) {
        this.parent = parent;
    }
}