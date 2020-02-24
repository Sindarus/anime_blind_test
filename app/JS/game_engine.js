class GameEngine {
    constructor() {
        this.players = [];
        this.seen_videos = {};

        this.options = {};

        this.is_playing = false;
        this.current_video = undefined;

        this.anime_blacklist = [];
        this.anime_whitelist = [];
    }

    add_player(player) {
        this.players.push(player);
    }

    compute_testable_videos_pool() {
        const all_animes = IndexedVideoList.merge_all(this.players.map(player => player.testable_videos));
        let pool = all_animes.subset(this.compute_testable_animes_pool());

        if(Object.keys(pool).length === 0){
            return pool;
        }

        Object.keys(this.seen_videos).forEach((anime, _) => {
            if(pool[anime] === undefined) return;
            this.seen_videos[anime].forEach((seen_video, _) => {
                pool[anime] = pool[anime].filter(video => video["file"] !== seen_video["file"]);
            });
            if(pool[anime].length === 0){
                delete pool[anime];
            }
        });

        if(Object.keys(pool).length === 0){
            // If the pool is empty because we've seen all videos, empty seen videos and return all testable videos
            this.seen_videos = {};
            console.log("Seen all videos, emptying seen_videos");
            return all_animes.subset(this.compute_testable_animes_pool());
        }

        return pool;
    }

    compute_testable_animes_pool() {
        return this.compute_all_animes_list()
            .filter(anime => anime.selected)
            .map(anime => anime["anime_name"])
    }

    compute_all_animes_list() {
        /* [{
                "anime_name": "...",
                "players": [...],
                "selected": ...
            }, ...]
        */
        let intersected_animes = intersection(this.players.map(player => player.testable_animes));
        let unioned_animes = union(this.players.map(player => player.testable_animes));

        let is_selected = anime => {
            if(this.anime_blacklist.has(anime)) return false;
            else if(this.anime_whitelist.has(anime)) return true;
            else if (this.options.joint_animes) return intersected_animes.has(anime);
            else return true;
        };

        return unioned_animes.map(anime => {
            return {
                anime_name: anime,
                players: this.players
                    .filter(player => player.has_seen(anime))
                    .sort((player_1, player_2) => {
                        return player_1.testable_animes.length - player_2.testable_animes.length
                    }),
                selected: is_selected(anime)
            }
        })
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

    toggle_anime_selection(anime_name, selected){
        if(selected === true){
            this.anime_blacklist.remove(anime_name);
            this.anime_whitelist.push(anime_name);
        }
        else {
            this.anime_whitelist.remove(anime_name);
            this.anime_blacklist.push(anime_name);
        }
    }
}
