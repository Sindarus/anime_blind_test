Vue.component('blind-tester-component', {
    props: ['m_game_engine'],
    data: function() {
        return {
            is_revealed: false,
            current_video: ""
        };
    },
    methods: {
        start_blindtest: function() {
            try {
                this.current_video = this.choose_video_to_blindtest();
                this.load_current_video();
            }
            catch (e) {
                alert(e);
                console.log("emitting 'stop-playing'");
                this.$emit("stop-playing");
            }
            console.log("blindtested video: ", this.current_video);
        },
        choose_video_to_blindtest: function() {
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
            let video_elt = this.$el.querySelector("video");
            video_elt.setAttribute("src", this.get_current_video_source());
            video_elt.load();
            video_elt.autoplay = true;
        },
        get_current_video_source(){
            const filename = this.current_video["file"];
            const ext = mimeToExt(this.current_video["mime"][0]);	// select first mime
            return "https://openings.moe/video/" + encodeURIComponent(filename + ext)
        }
    },
    template: `
        <div id="video_wrapper" v-show="m_game_engine.is_playing">
            <video controls id="video" style="opacity: 0;">
                <source>
            </video>
            <div id="spinner_container">
                <p id="timer"></p>
                <img id="spinner" src="/static/images/spinner_ds.png">
            </div>
            <div id="title_container" v-if="is_revealed">
                <div id="anime_title">Anime: {{ current_video["source"] }}</div>
                <div v-if="current_video.song !== 'undefined'">
                    <div v-if="current_video.song.title !== 'undefined'">Song: {{ current_video["song"]["title"] }}</div>
                    <div v-if="current_video.song.artist !== 'undefined'">Artist: {{ current_video["song"]["artist"] }}</div>
                </div>
            </div>
        </div>
    `
});
