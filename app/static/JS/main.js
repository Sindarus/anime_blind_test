// Interface options
TIME_BEFORE_REVEAL = 20
TIME_BEFORE_NEXT = 10

// Global variables
var user_animelist;
var animelist_availability;
var testable_animes;
var testable_videos;

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function mimeToExt(mime) {
		if (mime.startsWith("video/mp4")) return ".mp4";
		if (mime.startsWith("video/webm")) return ".webm";
		return "";
}

window.onload = function() {
	username_form_elt = document.querySelector('#nickname_form');
	username_form_button_elt = document.querySelector('#nickname_form button');
	username_form_input_elt = document.querySelector('#nickname_form input');
	username_form_loading_msg_elt = document.querySelector('#nickname_form .loading_msg');

	confirmation_form = document.querySelector("#confirmation_form");
	confirmation_form_animelist = document.querySelector('#confirmation_form #user_animelist');
	confirmation_form_button = document.querySelector("#confirmation_form button");

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

		let info = "Your anime list: " + user_animelist + "\n\n";
		info += "Animelist availability " + JSON.stringify(animelist_availability, null, 2) + "\n\n";
		info += "That's " + testable_animes.length + " out of " + user_animelist.length;
		confirmation_form_animelist.innerText = info
		confirmation_form.style.display = "block";

		console.log("Animes available for testing: ", testable_animes.length + " out of " + user_animelist.length)
	}

	confirmation_form_button.onclick = function() {
		confirmation_form.style.display = "none";
		video_wrapper_elt.style.display = "block";

		blindtest_new_video()
	};

	video.ontimeupdate = function(e) {
		if(video.currentTime > TIME_BEFORE_REVEAL + TIME_BEFORE_NEXT) {
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
        testable_animes = user_data["testable_animes"]
        testable_videos = user_data["testable_videos"]
	}
}

function choose_video_to_blindtest(){
	let selected_anime = testable_animes.randomElement()
	return testable_videos[selected_anime].randomElement()
}
