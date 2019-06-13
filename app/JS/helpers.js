function deep_copy(obj) {
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
