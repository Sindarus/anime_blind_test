class PausableTimout{
    constructor(){
        this.timeout_id = -1;
    }

    start(timeout){
        if(this.timeout_id !== -1) throw "Cannot start running timeout";
        this.start_time = Date.now();
        this.remaining_ms = timeout;

        return new Promise(((resolve, reject) => {
            this.reject_func = reject;
            this.resolve_func = resolve;
            this.set_timeout()
        }))
    };

    pause(){
        window.clearTimeout(this.timeout_id);
        this.timeout_id = -1;
        this.remaining_ms -= Date.now() - this.start_time;
    };

    resume(){
        if(this.timeout_id !== -1) return;
        this.set_timeout();
        this.start_time = Date.now();
    };

    clear(){
        window.clearTimeout(this.timeout_id);
        this.timeout_id = -1;
        this.reject_func();
    }

    resolve_aux(){
        this.timeout_id = -1;
        this.resolve_func();
    }

    set_timeout(){
        this.timeout_id = window.setTimeout(() => this.resolve_aux(), this.remaining_ms);
    }
}

class Timer{
    constructor(update_callback){
        this.update_callback = update_callback;
        this.pausable_timeout = new PausableTimout();
    }

    start(duration_s){
        this.update_callback(duration_s);
        if(duration_s <= 0) return Promise.resolve();
        return new Promise(((resolve, reject) => {
            this.pausable_timeout.start(1000)
                .then(() => this.start(duration_s - 1))
                .then(resolve, reject)
        }));
    }

    pause(){ this.pausable_timeout.pause(); }
    resume(){ this.pausable_timeout.resume(); }
    clear(){ this.pausable_timeout.clear(); }
}
