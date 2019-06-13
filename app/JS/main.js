//Mocking options (comment/uncomment to disable/enable)
MOCK_MODE = false;
MOCKED_API_RESPONSE = {
	user_animelist: ["Kakumeiki Valvrave"],
	animelist_availability: {
		"Kakumeiki Valvrave": "Kakumeiki Valvrave",
	},
	testable_animes: ["Kakumeiki Valvrave"],
	testable_videos: {
		"Kakumeiki Valvrave": [
			{
				"title": "Opening 1a",
				"source": "Kakumeiki Valvrave",
				"file": "KakumeikiValvrave-OP01a-NCBD",
				"mime": [
					"video/webm;codecs=\"vp9,opus\"",
					"video/mp4"
				],
				"song": {
					"title": "Preserved Roses",
					"artist": "T.M.Revolution x Nana Mizuki"
				}
			}
		]
	}
};

// Interface options
TIME_BEFORE_REVEAL = 20;
TIME_BEFORE_NEXT = 10;

let app = new Vue({
	el: '#app_container',
	data: {
		game_engine: (function() {a = new GameEngine(); console.log("game_engine:", a); return a})()
	},
	methods: {
		trigger_blind_tester_component: function() {
			this.game_engine.is_playing = true;
			this.$refs["blindTesterComp"].start_blindtest();
		}
	}
});

window.onload = function() {

	// video.ontimeupdate = function(e) {
	// 	if(video.ended || (video.currentTime > TIME_BEFORE_REVEAL + TIME_BEFORE_NEXT)) {
	// 		// We should get new video
	// 		video.style.opacity = 0;
	// 		title_container_elt.style.opacity = 0;
	// 		blindtest_new_video();
	// 	}
	// 	else if (video.currentTime > TIME_BEFORE_REVEAL) {
	// 		// Video should be revealed
	// 		video.style.opacity = 1;
	// 		title_container_elt.style.opacity = 1;
	// 		spinner_elt.style.opacity = 0;
	// 		timer_elt.innerText = Math.ceil(TIME_BEFORE_NEXT - (video.currentTime - TIME_BEFORE_REVEAL));
	// 	}
	// 	else {
	// 		// Video should play blacked out
	// 		video.style.opacity = 0;
	// 		title_container_elt.style.opacity = 0;
	// 		spinner_elt.style.opacity = 1;
	// 		timer_elt.innerText = Math.ceil(TIME_BEFORE_REVEAL - video.currentTime);
	// 	}
	// };
};
