//Mocking options
MOCK_MODE = true;
MOCKED_API_RESPONSE = {
	user_animelist: ["Macross Delta", "Nichijou"],
	animelist_availability: {
		"Macross Delta": "Macross Delta",
		"Nichijou": "Nichijou"
	},
	testable_animes: ["Macross Delta", "Nichijou"],
	testable_videos: {
		"Macross Delta": [
			{
				"title": "Opening 1a",
				"source": "Macross Delta",
				"file": "girigirilove",
				"mime": [
					"video/mp4",
				],
				"song": {
					"title": "Giri Giri Ai",
					"artist": "Unknown"
				}
			},
		],
		"Nichijou": [
			{
				"title": "Opening 1a",
				"source": "Nichijou",
				"file": "nichijou",
				"mime": [
					"video/mp4",
				],
				"song": {
					"title": "Giri Giri Ai",
					"artist": "Unknown"
				}
			}
		]
	}
};

let app = new Vue({
	el: '#app_container',
	data: {
		game_engine: (function() {a = new GameEngine(); console.log("game_engine:", a); return a})()
	},
	methods: {
		trigger_blind_tester_component: function() {
			this.game_engine.is_playing = true;
			this.$refs["blindTesterComp"].start_blindtest();
		},
		blindtest_is_ready(){
			return this.game_engine.compute_testable_animes_pool().length > 0;
		},
		get_css_disabled_style: get_css_disabled_style
	}
});
