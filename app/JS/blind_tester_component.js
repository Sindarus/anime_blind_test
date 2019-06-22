Vue.component('blind-tester-component', {
    props: ['m_game_engine'],
    data: function() {
        return {
            is_revealed: false,
            current_video: "",
            count_down_value: 0,
            video_elt: undefined,
            should_show_info: false
        };
    },
    mounted() {
        this.video_elt = this.$el.querySelector("video");
        this.timer = new Timer(x => this.count_down_value = x);
        this.video_elt.onerror = e => {
            this.stop_blindtest();
            console.log("There was an error on the video while blindtesting, cannot continue. error: ", e);
            alert("There was an error on the video while blindtesting, cannot continue. error:" + e);
        };
        this.video_elt.oncanplaythrough = e => {
            this.video_elt.focus();
        };
        console.log("options: ", this.m_game_engine.options)
    },
    methods: {
        start_blindtest() {
            try {
                this.blindtest_loop();
            }
            catch (e) {
                this.stop_blindtest();
                console.log("There was an error while blindtesting, cannot continue. error: ", e);
                alert("There was an error while blindtesting, cannot continue. error:" + e);
            }
            console.log("blindtested video: ", this.current_video);
        },
        blindtest_loop(){
            this.reset();
            this.current_video = this.choose_video_to_blindtest();
            this.load_current_video();
            this.timer.start(this.m_game_engine.options.time_till_reveal)
                .then(() => {
                    this.is_revealed = true;
                    this.show_video_info();
                    return this.timer.start(this.m_game_engine.options.time_till_next_vid);
                })
                .then(() => {
                    if(! this.m_game_engine.options.watch_till_end) {
                        this.blindtest_loop();
                    }
                },(e) => {
                    // Timer has been .clear()'ed. Do nothing.
                })
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
            this.video_elt.autoplay = true;
            this.video_elt.load();
        },
        get_current_video_source() {
            const filename = this.current_video["file"];
            const ext = mimeToExt(this.current_video["mime"][0]);	// select first mime
            if(MOCK_MODE === true) {
                return "/static/videos/" + encodeURIComponent(filename + ext)
            }
            else {
                return "https://openings.moe/video/" + encodeURIComponent(filename + ext)
            }
        },
        stop_blindtest(){
            this.$emit("stop-playing");
            this.reset();
        },
        show_video_info() {
            this.should_show_info = true;
            this.hide_info_timeout_id = window.setTimeout(
                () => {
                    this.should_show_info = false;
                    this.hide_info_timeout_id = -1;
                },
                4000
            )
        },
        reset(){
            this.video_elt.pause();
            this.timer.clear();
            this.is_revealed = false;
            this.should_show_info = false;
            if(this.hide_info_timeout_id !== -1){
                window.clearTimeout(this.hide_info_timeout_id);
                this.hide_info_timeout_id = -1;
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
            if(this.cur_vid_has_song_title()) return this.current_video.song.title;
            else return undefined
        },
        get_cur_vid_song_artist() {
            if(this.cur_vid_has_song_artist()) return this.current_video.song.artist;
            else return undefined
        },
        get_video_opacity(){
            if(this.is_revealed) return '1';
            else return MOCK_MODE ? '0.2' : '0';
        }
    },
    template: `
        <div class="blind_tester_component" v-show="m_game_engine.is_playing">
            <video controls id="video"
                   v-bind:style="{opacity: get_video_opacity()}"
                   v-on:pause="timer.pause()"
                   v-on:play="timer.resume()"
                   v-on:ended="blindtest_loop()">
            </video>
            <div class="UI_block top left">
                <span class="UI_button" v-on:click="stop_blindtest()">
                    <i class="fas fa-2x fa-arrow-left"></i>
                </span>
                <span class="UI_button" v-on:click="blindtest_loop()">
                    <i class="fas fa-2x fa-running"></i>
                </span>
            </div>
            <div class="UI_block top right">
                <p id="timer" v-show="!is_revealed || !m_game_engine.options.watch_till_end">{{ count_down_value }}</p>
            </div>
            <div class="video_info_overlay" v-show="is_revealed && should_show_info">
                <div class="video_info_container">
                    <div class="anime_title">{{ current_video["source"] }}</div>
                    <div class="song_info_container" v-show="cur_vid_has_song()">
                        <div v-if="cur_vid_has_song_title()">Song: {{ get_cur_vid_song_title() }}</div>
                        <div v-if="cur_vid_has_song_artist()">Artist: {{ get_cur_vid_song_artist() }}</div>
                    </div>
                </div>
            </div>
        </div>
    `
});
