function deep_copy(obj) {
    if(obj === undefined){
        return undefined
    }
    return JSON.parse(JSON.stringify(obj));
}

Array.prototype.intersect = function(array2) {
    return this.filter(value => array2.includes(value));
};

Array.prototype.unite = function(array2){
    return this.concat(array2.filter(item => {
        return this.indexOf(item) < 0;
    }));
};

Array.prototype.has = function(obj) {
    return this.find(cur_obj => cur_obj === obj) !== undefined;
};

Array.prototype.remove = function(obj) {
    let n_removed = 0;
    const i = this.findIndex(cur_obj => cur_obj === obj);
    if(i !== -1){
        this.splice(i, 1);
        n_removed = 1 + this.remove(obj);    // remove all occurences
    }
    return n_removed;
};

function intersection(array_of_arrays){
    if(array_of_arrays.length === 0){
        return [];
    }
    const reduce_func = function(accumulator, cur_val){
        return accumulator.intersect(cur_val);
    };
    return array_of_arrays.reduce(reduce_func);
}

function union(array_of_arrays){
    const reduce_func = function(accumulator, cur_val){
        return accumulator.unite(cur_val);
    };
    return array_of_arrays.reduce(reduce_func, []);
}

Array.prototype.randomIndex = function () {
    return Math.floor(Math.random() * this.length);
};

Array.prototype.randomElt = function () {
    return this[this.randomIndex()];
};


function mimeToExt(mime) {
    if (mime.startsWith("video/mp4")) return ".mp4";
    if (mime.startsWith("video/webm")) return ".webm";
    return "";
}

function get_css_disabled_style(is_disabled){
    if(is_disabled){
        return {
            'opacity': 0.3,
            'pointer-events': 'none'
        }
    }
    else {
        return {}
    }
}

function trim_whitespaces(str){
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

class PropertyAnimator {
    constructor(obj, prop){
        this.pausable_interval = new PausableInterval();
        this.obj = obj;
        this.prop = prop;
    }

    async animate_property(new_value, duration, easing, interval) {
        console.log("animating property", this.prop, " of ", this.obj);
        this.original_value = this.obj[this.prop];
        this.new_value = new_value;
        const delta = new_value - this.original_value;
        if (!delta || !duration || !easing || !interval) {
            console.log("Nothing to animate, resolving now.")
            this.obj[this.prop] = new_value;
            return Promise.resolve();
        }
        const ticks = Math.floor(duration / interval);
        let tick = 1;
        return new Promise((resolve, reject) => {
            this.pausable_interval.start(() => {
                this.obj[this.prop] = this.original_value + (
                    easing(tick / ticks) * delta
                );
                if (++tick === ticks) {
                    this.pausable_interval.clear();
                    resolve();
                }
            }, interval)
            .then(resolve, reject);
        });
    }

    pause(){ this.pausable_interval.pause(); }
    resume(){ this.pausable_interval.resume(); }
    is_cleared() { return this.pausable_interval.is_cleared(); }
    cancel(){
        if(this.is_cleared()) return;
        this.pausable_interval.clear();
        this.obj[this.prop] = this.original_value;
    }
    skip_to_end(){
        if(this.is_cleared()) return;
        this.pausable_interval.clear();
        this.obj[this.prop] = this.new_value;
    }
}

