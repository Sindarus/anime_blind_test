class GameEngine {
	constructor() {
		this.players = [];
		this.seen_videos = {};

		this.options = {};
	}

	add_player(player) {
		this.players.push(player);
	}

	compute_testable_anime_pool() {
		let pool = IndexedVideoList.merge_all(this.players.map(player => player.testable_videos));
		//TODO: add more options and multiplayer support
		if (allow_video_looping == false) {
			Object.keys(this.seen_videos).forEach(function(anime, anime_i){
				this.seen_videos[anime].forEach(function(seen_video, video_i){
					pool[anime] = pool[anime].filter(function(video){
						video["file"] != seen_video["file"];
					});
				});
				if(pool[anime].length == 0){
					delete pool[anime];
				}
			});
		}
		return pool;
	}

	add_seen_video(anime, video){
		if(this.seen_videos[anime] instanceof Array){
			this.seen_videos[anime].push(video);
		}
		else{
			this.seen_videos[anime] = [video];
		}
	}
}
