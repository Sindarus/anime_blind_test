TESTABLE_ANIME_TYPES = ["TV", "OVA", "ONA"]

var user_animelist;
var player;

window.onload = function() {
	username_form_elt = document.querySelector('#nickname_form');
	username_form_button_elt = document.querySelector('#nickname_form button');
	username_form_input_elt = document.querySelector('#nickname_form input');
	username_form_loading_msg_elt = document.querySelector('#nickname_form .loading_msg');

	confirmation_form = document.querySelector("#confirmation_form")
	confirmation_form_animelist = document.querySelector('#confirmation_form #user_animelist');
	confirmation_form_button = document.querySelector("#confirmation_form button")

	username_form_button_elt.onclick = function() {
		let user_nickname = username_form_input_elt.value;
		username_form_loading_msg_elt.style.display = "block";

		//"https://myanimelist.net/animelist/" + user_nickname + "/load.json?offset=0&status=2",
		let query_url = "https://api.jikan.moe/v3/user/" + user_nickname + "/animelist/completed"
		let r = new XMLHttpRequest();
		r.open("GET", query_url, false);  // async: false
		r.send();

		if (r.status != 200){
			console.log("Could not load animelist : got status ", r.status, " with content : ", r.response)
			alert("Your animelist could not be retrieved. Please check your username and retry.");
			username_form_loading_msg_elt.style.display = "none";
		}
		else{
			let user_full_animelist = JSON.parse(r.response)["anime"]
			user_animelist = user_full_animelist.filter(
				elt => TESTABLE_ANIME_TYPES.includes(elt["type"])
			).map(
				elt => elt["title"]
			)

			//hide username_form
			username_form_elt.style.display = "none";

			confirmation_form_animelist.innerText = "Your anime list : " + user_animelist;
			confirmation_form.style.display = "block";
		}
	}

	confirmation_form_button.onclick = function() {
		
	}
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('video_placeholder', {
		height: '360',
		width: '640',
		videoId: 'M7lc1UVf-VE',
		events: {
			'onReady': onPlayerReady,
			//'onStateChange': onPlayerStateChange
		},
		playerVars: {
			enablejsapi: 1,
			controls: 0,
			disablekb: 1,
			modestbranding: 0
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo()
}
