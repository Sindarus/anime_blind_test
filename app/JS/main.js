//Mocking options (comment/uncomment to disable/enable)
// MOCKED_API_RESPONSE = {
// 	user_animelist: ["Macross Delta"],
// 	animelist_availability: {
// 		"Macross Delta": "Macross Delta"
// 	},
// 	testable_animes: ["Macross Delta"],
// 	testable_videos: {
// 		"Macross Delta": [
// 	        {
// 	            "title": "Opening 1",
// 	            "source": "Macross Delta",
// 	            "file": "lolilol",
// 	            "mime": [
// 	                "video/mp4",
// 	                "video/webm;codecs=\"vp9,opus\""
// 	            ],
// 	            "song": {
// 	                "title": "Giri giri ai",
// 	            }
// 	        }
// 	    ]
// 	}
// }

// Interface options
TIME_BEFORE_REVEAL = 20
TIME_BEFORE_NEXT = 10

// Global variables
var game_engine = new GameEngine()

// Configuration variables
var allow_video_looping = false; // TODO: User-defined configuration

var app = new Vue({
	el: '#main_window_container',
	data: {
		game_engine: game_engine
	}
})

window.onload = function() {
	main_window_container_elt = document.querySelector('#main_window_container');

	username_form_elt = document.querySelector('#username_form');
	username_form_button_elt = document.querySelector('#players .button');
	username_form_input_elt = document.querySelector('#players input');
	username_form_loading_msg_elt = document.querySelector('#username_form .loading_msg');

	testable_animes_elt = document.querySelector('#testable_animes_section #animelist');
	blind_test_button_elt = document.querySelector("#blind_test_button");

	video_wrapper_elt = document.querySelector("#video_wrapper");
	video_elt = document.querySelector("#video")
	video_source_elt = document.querySelector("#video source");
	spinner_container_elt = document.querySelector("#spinner_container")
	spinner_elt = document.querySelector("#spinner")
	timer_elt = document.querySelector("#timer")

	title_container_elt = document.querySelector("#title_container")
	title_elt = document.querySelector("#title")

	username_form_button_elt.onclick = function() {
		// TODO: validate user input
		let username = username_form_input_elt.value;
		let cur_player = new Player(username);

		username_form_loading_msg_elt.style.display = "block";
		load_user_data_success = cur_player.load_user_data();
		username_form_loading_msg_elt.style.display = "none";

		if(load_user_data_success == -1){
			alert("Your animelist could not be retrieved. Please check your username and retry.");
			return;
		}

		game_engine.players.push(cur_player)

		// let info = "Animelist availability " + JSON.stringify(cur_player.animelist_availability, null, 2) + "\n\n";
		// info += "That's " + cur_player.testable_animes.length + " out of " + cur_player.animelist.length;
		// testable_animes_elt.innerText = info

		// console.log("Animes available for testing: ", cur_player.testable_animes.length + " out of " + cur_player.animelist.length)
	}

	blind_test_button_elt.onclick = function() {
		main_window_container_elt.style.display = "none";
		video_wrapper_elt.style.display = "block";

		blindtest_new_video()
	};

	video.ontimeupdate = function(e) {
		if(video.ended || (video.currentTime > TIME_BEFORE_REVEAL + TIME_BEFORE_NEXT)) {
			// We should get new video
			video.style.opacity = 0;
			title_container_elt.style.opacity = 0;
			blindtest_new_video()
		}
		else if (video.currentTime > TIME_BEFORE_REVEAL) {
			// Video should be revealed
			video.style.opacity = 1;
			title_container_elt.style.opacity = 1;
			spinner_elt.style.opacity = 0;
			timer_elt.innerText = Math.ceil(TIME_BEFORE_NEXT - (video.currentTime - TIME_BEFORE_REVEAL))
		}
		else {
			// Video should play blacked out
			video.style.opacity = 0;
			title_container_elt.style.opacity = 0;
			spinner_elt.style.opacity = 1;
			timer_elt.innerText = Math.ceil(TIME_BEFORE_REVEAL - video.currentTime)
		}
	};
}

function blindtest_new_video() {
	current_video = choose_video_to_blindtest()
	console.log("blindtested video: ", current_video)

	title_elt.innerText = "Anime: " + current_video["source"] + "\n"
	if (typeof current_video["song"] !== 'undefined'){
		if (typeof current_video["song"]["title"] !== 'undefined'){
			title_elt.innerText += "Song: " + current_video["song"]["title"] + "\n"
		}
		if (typeof current_video["song"]["artist"] !== 'undefined'){
			title_elt.innerText += "Artist: " + current_video["song"]["artist"]
		}
	}
	
	filename = current_video["file"]
	ext = mimeToExt(current_video["mime"][0])	// select first mime
	video_source_elt.setAttribute("src", "https://openings.moe/video/" + encodeURIComponent(filename + ext))
	video_elt.load()
	video_elt.autoplay = true
}

function choose_video_to_blindtest() {
	let testable_anime_pool = game_engine.compute_testable_anime_pool()

	let selected_anime = Object.keys(testable_anime_pool).randomElt()
	let selected_video = testable_anime_pool[selected_anime].randomElt()

	if (allow_video_looping == false) {
		game_engine.add_seen_video(selected_anime, selected_video)
	}

	return selected_video
}
