Vue.component('blind-tester-component', {
    props: ['m_game_engine'],
    data: function() {
        return {
            is_revealed: false,
            current_video: "",
            count_down_value: 0,
            video_elt: undefined
        };
    },
    mounted() {
        this.video_elt = this.$el.querySelector("video");
    },
    methods: {
        start_blindtest() {
            try {
                this.blindtest_loop()
            }
            catch (e) {
                alert(e);
                console.log("emitting 'stop-playing'");
                this.$emit("stop-playing");
                this.video_elt.pause()
            }
            console.log("blindtested video: ", this.current_video);
        },
        blindtest_loop(){
            const _this = this;
            this.current_video = this.choose_video_to_blindtest();
            this.load_current_video();
            this.count_down(5)
                .then(function() {
                    _this.is_revealed = true;
                })
                .then(() => _this.count_down(5))
                .then(function() {
                    _this.is_revealed = false;
                    _this.blindtest_loop();
                });
        },
        choose_video_to_blindtest() {
            const testable_video_pool = this.m_game_engine.compute_testable_videos_pool();
            if(Object.keys(testable_video_pool).length === 0){
                throw "no anime to blindtest"
            }

            const selected_anime = Object.keys(testable_video_pool).randomElt();
            const selected_video = testable_video_pool[selected_anime].randomElt();

            this.m_game_engine.add_seen_video(selected_anime, selected_video);

            return selected_video;
        },
        load_current_video() {
            this.video_elt.setAttribute("src", this.get_current_video_source());
            this.video_elt.load();
            this.video_elt.autoplay = true;
        },
        get_current_video_source() {
            const filename = this.current_video["file"];
            const ext = mimeToExt(this.current_video["mime"][0]);	// select first mime
            return "https://openings.moe/video/" + encodeURIComponent(filename + ext)
        },
        count_down(time_sec) {
            const _this = this;
            _this.count_down_value = time_sec;
            if(time_sec !== 0) {
                return new Promise(function (resolve, reject) {
                    window.setTimeout(function(){
                        _this.count_down(time_sec-1).then(resolve)
                    }, 1000);
                })
            }
            else {
                return Promise.resolve();
            }
        },
        cur_vid_has_song() {
            return this.current_video.song !== undefined;
        },
        cur_vid_has_song_title() {
            if(this.cur_vid_has_song()) return this.current_video.song.title !== undefined;
            else return undefined;
        },
        cur_vid_has_song_artist() {
            if(this.cur_vid_has_song()) return this.current_video.song.artist !== undefined;
            else return undefined;
        },
        get_cur_vid_song_title() {
            if(this.cur_vid_has_song_title()) return this.current_video.song.artist;
            else return undefined
        },
        get_cur_vid_song_artist() {
            if(this.cur_vid_has_song_artist()) return this.current_video.song.artist;
            else return undefined
        }
    },
    template: `
        <div class="blind_tester_component" v-show="m_game_engine.is_playing">
            <video controls id="video" v-bind:style="{opacity: is_revealed ? 100 : 0}">
                <source>
            </video>
            <div id="spinner_container">
                <p id="timer">{{ count_down_value }}</p>
                <img id="spinner" src="/static/images/spinner_ds.png">
            </div>
            <div id="title_container" v-show="is_revealed">
                <div id="anime_title">Anime: {{ current_video["source"] }}</div>
                <div v-show="cur_vid_has_song()">
                    <div v-if="cur_vid_has_song_title()">Song: {{ get_cur_vid_song_title() }}</div>
                    <div v-if="cur_vid_has_song_artist()">Artist: {{ get_cur_vid_song_artist() }}</div>
                </div>
            </div>
        </div>
    `
});
