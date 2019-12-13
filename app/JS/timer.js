class PausableTimout{
    constructor(){
        this.timeout_id = -1;
        this._is_cleared = true;
        this._is_paused = false;
    }

    start(timeout){
        this._is_cleared = false;
        if(this.timeout_id !== -1) throw "Cannot start running timeout";
        this.start_time = Date.now();
        this.remaining_ms = timeout;

        return new Promise(((resolve, reject) => {
            this.reject_func = reject;
            this.resolve_func = resolve;
            this._set_timeout()
        }))
    };

    pause(){
        if(this._is_paused || this._is_cleared) return;
        this._is_paused = true;
        window.clearTimeout(this.timeout_id);
        this.timeout_id = -1;
        this.remaining_ms -= Date.now() - this.start_time;
    };

    resume(){
        if(!this._is_paused || this._is_cleared) return;
        this._is_paused = false;
        this._set_timeout();
        this.start_time = Date.now();
    };

    clear(){
        if(this._is_cleared) return;
        this._is_paused = false;
        this._is_cleared = true;
        window.clearTimeout(this.timeout_id);
        this.timeout_id = -1;
        this.reject_func();
    }

    _resolve_aux(){
        this._is_cleared = true;
        this.timeout_id = -1;
        this.resolve_func();
    }

    _set_timeout(){
        this.timeout_id = window.setTimeout(() => this._resolve_aux(), this.remaining_ms);
    }

    is_cleared(){
        return this._is_cleared
    }
}

class PausableInterval{
    constructor(){
        this.pausable_timeout = new PausableTimout();
    }

    start(func, interval) {
        return this.pausable_timeout.start(interval)
        .then(() => {
            func();
            return this.start(func, interval);
        })
    }

    pause(){ this.pausable_timeout.pause(); }
    resume(){ this.pausable_timeout.resume(); }
    clear(){ this.pausable_timeout.clear(); }
    is_cleared() { return this.pausable_timeout.is_cleared(); }
}

class Timer{
    constructor(update_callback){
        this.update_callback = update_callback;
        this.pausable_timeout = new PausableTimout();
    }

    start(duration_s, start_at=undefined){
        if(start_at === undefined) start_at = duration_s;
        this.update_callback(start_at);
        if(duration_s <= 0) return Promise.resolve();
        return new Promise(((resolve, reject) => {
            this.resolve_func = resolve;
            this.reject_func = reject;
            this.pausable_timeout.start(1000)
                .then(() => this.start(duration_s - 1, start_at - 1))
                .then(resolve, reject)
        }));
    }

    jump_to_end(){
        this.resolve_func();
        this.resolved_early = true;
        this.pausable_timeout.clear();
    }

    pause(){ this.pausable_timeout.pause(); }
    resume(){ this.pausable_timeout.resume(); }
    clear(){ this.pausable_timeout.clear(); }
    is_cleared() { return this.pausable_timeout.is_cleared(); }
}
