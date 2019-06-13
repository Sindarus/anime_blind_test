class IndexedVideoList {
	/* Anime-indexed video list like
	{
		'anime1': [<videos>]
		'anime2': [<videos>]
	}
	*/

	constructor(indexed_video_list_obj){
		/*
		@param {Object} video_list_obj - An object with anime names as keys and video lists
										 as values.
		*/
		Object.assign(this, deep_copy(indexed_video_list_obj));
	}

	get_animes() {
		/* Get all animes contained in this indexed video list
		@returns {Array} An array with all anime names
		*/
		return Object.keys(this);
	}

	add_from(ixed_video_list) {
		/*
		@param {IndexedVideoList} source_ixed_video_list - Indexed video list to copy videos from
		*/
		for (let cur_anime of ixed_video_list.get_animes()){
			if(this.hasOwnProperty(cur_anime)){
				IndexedVideoList._assign_video_list(this[cur_anime], ixed_video_list[cur_anime]);
			}
			else{
				this[cur_anime] = deep_copy(ixed_video_list[cur_anime]);
			}
		}
	}

	subset(anime_list){
		let out = {};
		anime_list.forEach((anime, anime_i) => {
			out[anime] = deep_copy(this[anime]);
		});
		return new IndexedVideoList(out);
	}

	length(){
		return Object.keys(this).reduce((accumulator, cur_anime) => {
			return accumulator + this[cur_anime].length
		}, 0);
	}

	static _assign_video_list(target_video_list, source_video_list){
		for (let cur_video of source_video_list) {
			if (! IndexedVideoList._video_is_in_video_list(cur_video, target_video_list)){
				target_video_list.push(deep_copy(cur_video));
			}
		}
	}

	static _video_is_in_video_list(video, video_list){
		return video_list.find(elt => elt["file"] === video["file"]) !== undefined;
	}

	static merge_all(indexed_video_lists){
		if (indexed_video_lists.length === 0){
			return new IndexedVideoList({});
		}
		else if (indexed_video_lists.length === 1){
			return new IndexedVideoList(indexed_video_lists[0]);
		}
		else {
			let final_ixed_video_list = new IndexedVideoList(indexed_video_lists[0]);
			for (let i = 1; i<indexed_video_lists.length; i++){
				final_ixed_video_list.add_from(indexed_video_lists[i]);
			}
			return final_ixed_video_list;
		}
	}
}
