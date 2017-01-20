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
        var remCb = typeof callback == 'function' ? callback : this.mapAlias[callback];
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
        var events = this;
        return new Promise(function(resolv, reject){
            var ev = events.map[event] || [],
                evOnce = events.mapOnce[event] || [],
                result = [];
            for (var i = 0, len = ev.length; i < len; i++) {
                result.push(events.call(ev[i], data));
            }
            while (evOnce.length > 0) result.push(events.call(evOnce.shift(), data));
            resolv(result);
        });
    }
    /**
     * Внутренний метод для запуска обработчиков
     * @param callback
     * @param data
     */
    call (callback, data) {
        try {
            return callback.call(this.parent, data ? data : null);
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * Назначить родителя обработчикам
     * @param parent
     */
    setParent (parent) {
        this.parent = parent;
    }
}