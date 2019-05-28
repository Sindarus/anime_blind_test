deep_copy = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

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
