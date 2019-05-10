TESTABLE_ANIME_TYPES = ["TV", "OVA", "ONA"]
TIME_BEFORE_REVEAL = 5
TIME_BEFORE_NEXT = 5

AVAILABLE_VIDEOS_MOCK = [
    {
        "title": "Insert song 1",
        "source": "girigiri",
        "file": "girigirilove",
        "mime": [
            "video/mp4"
        ],
        "song": {
            "title": "Giri Giri Ai",
            "artist": "?"
        }
    },
]
USER_ANIMELIST_MOCK = ['girigiri']

var indexed_available_video_items;
var testable_user_animes;

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

	indexed_available_video_items = load_available_video_items()

	username_form_button_elt.onclick = function() {

		let username = username_form_input_elt.value;

		username_form_loading_msg_elt.style.display = "block";
		let user_animelist = get_user_anime_list(username)
		username_form_loading_msg_elt.style.display = "none";

		if(user_animelist == -1){
			alert("Your animelist could not be retrieved. Please check your username and retry.");
			return;
		}

		//hide username_form
		username_form_elt.style.display = "none";

		testable_user_animes = compute_testable_user_animes(user_animelist, indexed_available_video_items)

		let info = "Your anime list: " + user_animelist + "\n\n";
		info += "Available animes for testing : " + testable_user_animes + "\n\n";
		info += "That's " + testable_user_animes.length + " out of " + user_animelist.length + "\n\n";
		info += "Unavailable animes:" + user_animelist.filter(elt => !testable_user_animes.includes(elt));
		confirmation_form_animelist.innerText = info
		confirmation_form.style.display = "block";

		console.log("Animes available for testing: ", testable_user_animes.length + " out of " + user_animelist.length)
	}

	confirmation_form_button.onclick = function() {
		confirmation_form.style.display = "none";
		video_wrapper_elt.style.display = "block";

		blindtest_new_video()
	};

	video.ontimeupdate = function(e) {
		console.log("video time update")
		if(video.currentTime > TIME_BEFORE_REVEAL + TIME_BEFORE_NEXT) {
			// We should get new video
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

	title_elt.innerText = "Anime: " + current_video["source"] + "\n"
	title_elt.innerText += "Song: " + current_video["song"]["title"] + "\n"
	title_elt.innerText += "Artist: " + current_video["song"]["artist"]
	
	filename = current_video["file"]
	ext = mimeToExt(current_video["mime"][0])	// select first mime

	video_source_elt.setAttribute("src", "videos/" + encodeURIComponent(filename + ext))
	//video_source_elt.setAttribute("src", "https://openings.moe/video/" + encodeURIComponent(filename + ext))
	video_elt.load()
	video_elt.autoplay = true

	choose_video_to_blindtest
}

function get_user_anime_list(username){
	console.log("Retrieving user animelist")
	if (typeof USER_ANIMELIST_MOCK !== 'undefined'){
		console.log("User animelist was mocked with ", USER_ANIMELIST_MOCK.length, " animes.")
		return USER_ANIMELIST_MOCK
	}
	//"https://myanimelist.net/animelist/" + username + "/load.json?offset=0&status=2",
	let query_url = "https://api.jikan.moe/v3/user/" + username + "/animelist/completed"
	let r = new XMLHttpRequest();
	r.open("GET", query_url, false);  // async: false
	
	r.send();

	if (r.status != 200) {
		console.log("Could not load animelist : got status ", r.status, " with content : ", r.response)
		return -1
	}
	else{
		let user_full_animelist = JSON.parse(r.response)["anime"]
		let user_animelist = user_full_animelist.filter(
			elt => TESTABLE_ANIME_TYPES.includes(elt["type"])
		).map(
			elt => elt["title"].toLowerCase()
		)
		console.log("User ", username, " has got ", user_full_animelist.length, " animes, of which ", user_animelist.length, " are eligible to blindtesting.");
		return user_animelist;
	}
}

function load_available_video_items(){
	console.log("Loading openings.moe video list")
	if (typeof AVAILABLE_VIDEOS_MOCK !== 'undefined'){
		console.log("Loaded mock list of ", AVAILABLE_VIDEOS_MOCK.length, " videos.")
		return index_video_items(AVAILABLE_VIDEOS_MOCK)
	}
	let query_url = "https://openings.moe/api/list.php"
	let r = new XMLHttpRequest();
	r.open("GET", query_url, false);  // async: false
	r.send();

	if (r.status != 200) {
		console.log("Could not load available animes : got status ", r.status, " with content : ", r.response)
		alert("Could not load the list of available animes.");
	}
	else {
		let available_video_items = JSON.parse(r.response)
		console.log("Successfully loaded list of ", available_video_items.length, " videos.")
		return index_video_items(available_video_items)
	}
}

function compute_testable_user_animes(user_animelist, indexed_available_video_items) {
	/*
	user_animelist: array of lowercased strings
	indexed_available_video_items: object whose keys are lowercased strings
	*/
	available_animes = Object.keys(indexed_available_video_items)
	return available_animes.filter(
		value => user_animelist.includes(value)
	)
}

function index_video_items(video_items) {
	let indexed_items = {};
	for(var i=0; i<video_items.length; i++){
		let cur_video_item = video_items[i];
		let cur_video_source = cur_video_item["source"].toLowerCase()
		if(indexed_items[cur_video_source] instanceof Array){
			indexed_items[cur_video_source].push(cur_video_item)
		}
		else{
			indexed_items[cur_video_source] = [cur_video_item]
		}
	}
	return indexed_items
}

function choose_video_to_blindtest(){
	let selected_anime = testable_user_animes.randomElement()
	return indexed_available_video_items[selected_anime].randomElement()
}
