class GameEngine {
	constructor() {
		this.players = [];
		this.seen_videos = {};

		this.options = {
			joint_animes: true,
			prevent_looping: true
		};

		this.is_playing = false;
		this.current_video = undefined;
	}

	add_player(player) {
		this.players.push(player);
	}

	compute_testable_videos_pool() {
		let all_animes = IndexedVideoList.merge_all(this.players.map(player => player.testable_videos));
		var pool = all_animes.subset(this.compute_testable_animes_pool());

		if(Object.keys(pool).length === 0){
			return pool;
		}

		if(this.options.prevent_looping) {
			Object.keys(this.seen_videos).forEach((anime, anime_i) => {
				this.seen_videos[anime].forEach((seen_video, video_i) => {
					pool[anime] = pool[anime].filter(video => video["file"] !== seen_video["file"]);
				});
				if(pool[anime].length === 0){
					delete pool[anime];
				}
			});
		}
		if(Object.keys(pool).length === 0){
			// If the pool is empty because we've seen all videos, empty seen videos and return all testable videos
			this.seen_videos = {};
			console.log("Seen all videos, emptying seen_videos");
			return all_animes.subset(this.compute_testable_animes_pool());
		}

		return pool;
	}

	compute_testable_animes_pool() {
		let pool;
		if(this.options.joint_animes){
			pool = intersection(this.players.map(player => player.testable_animes));
		}
		else {
			pool = union(this.players.map(player => player.testable_animes));
		}
		return pool;
	}

	add_seen_video(anime, video){
		if(this.seen_videos[anime] instanceof Array){
			let already_seen = this.seen_videos[anime]
				.filter(cur_video => cur_video["file"] === video["file"])
				.length !== 0;
			if(!already_seen){
				this.seen_videos[anime].push(video);
			}
		}
		else{
			this.seen_videos[anime] = [video];
		}
	}
}
