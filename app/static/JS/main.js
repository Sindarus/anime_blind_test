// Interface options
TIME_BEFORE_REVEAL = 20
TIME_BEFORE_NEXT = 10

// Global variables
var user_animelist;
var animelist_availability;
var testable_animes_full;
var testable_videos_full;
var testable_animes;
var testable_videos;

// Configuration variables
var allow_video_looping = false; // TODO: User-defined configuration

Array.prototype.randomIndex = function () {
    return Math.floor(Math.random() * this.length)
}

function mimeToExt(mime) {
		if (mime.startsWith("video/mp4")) return ".mp4";
		if (mime.startsWith("video/webm")) return ".webm";
		return "";
}

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

		username_form_loading_msg_elt.style.display = "block";
		load_user_data_success = load_user_data(username)
		username_form_loading_msg_elt.style.display = "none";

		if(load_user_data_success == -1){
			alert("Your animelist could not be retrieved. Please check your username and retry.");
			return;
		}

		//hide username_form
		username_form_elt.style.display = "none";

		let info = "Animelist availability " + JSON.stringify(animelist_availability, null, 2) + "\n\n";
		info += "That's " + testable_animes.length + " out of " + user_animelist.length;
		testable_animes_elt.innerText = info

		console.log("Animes available for testing: ", testable_animes.length + " out of " + user_animelist.length)
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

	choose_video_to_blindtest
}

function load_user_data(username){
    console.log("Retrieving user anime data")
    let query_url = "/api/v1/get-testable-videos/from-MAL"
	let r = new XMLHttpRequest();
	r.open("POST", query_url, false);  // async: false
	r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	r.send(`MAL_username=${username}`); // backticks are required for string interpolation to work

	if (r.status != 200) {
		console.log("Could not load your animelist : got status ", r.status, " with content : ", r.response)
		return -1
	}
	else {
	    let user_data = JSON.parse(r.response)
        user_animelist = user_data["user_animelist"]
        animelist_availability = user_data["animelist_availability"]
        testable_animes_full = testable_animes = user_data["testable_animes"]
        testable_videos_full = testable_videos = user_data["testable_videos"]
	}
}

function choose_video_to_blindtest() {
	let selected_anime_index = testable_animes.randomIndex()
	let selected_anime = testable_animes[selected_anime_index]
	let selected_video_index = testable_videos[selected_anime].randomIndex()
	let selected_video = testable_videos_full[selected_anime][selected_video_index]
	if (allow_video_looping == false) {
		remove_video_from_array(selected_anime, selected_anime_index, selected_video_index)
	}
	return selected_video
}

function remove_video_from_array(selected_anime, selected_anime_index, selected_video_index) {
	// Delete video from list
	testable_videos[selected_anime].splice(selected_video_index, 1);
	// If no video left, delete anime
	if (testable_videos[selected_anime].length == 0) {
		delete testable_videos[selected_anime]
		testable_animes.splice(selected_anime_index, 1)
		// Reset arrays if empty
		// TODO : Add warning of looping for user
		if (testable_animes.length == 0) {
			testable_animes = testable_animes_full
			testable_videos = testable_videos_full
		}
	}
}
