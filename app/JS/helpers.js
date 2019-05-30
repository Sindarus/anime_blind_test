deep_copy = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

Array.prototype.intersect = function(array2) {
	return this.filter(value => array2.includes(value));
};

Array.prototype.unite = function(array2){
	_this = this;
	return _this.concat(array2.filter(function (item) {
	    return _this.indexOf(item) < 0;
	}));
};

intersection = function(array_of_arrays){
	if(array_of_arrays.length == 0){
		return [];
	}
	reduce_func = function(accumulator, cur_val){
		return accumulator.intersect(cur_val);
	};
	return array_of_arrays.reduce(reduce_func);
};

union = function(array_of_arrays){
	reduce_func = function(accumulator, cur_val){
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
