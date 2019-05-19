function Player(username) {
	this.username = username

	this.animelist = undefined
	this.animelist_availability = undefined
	this.testable_animes = undefined
	this.testable_videos = undefined

	this.load_user_data = function() {
		console.log("Retrieving user anime data for user", this.username)

		if (typeof MOCKED_API_RESPONSE !== 'undefined'){
			var r = {
				status: 200,
				response: JSON.stringify(MOCKED_API_RESPONSE)
			};
		}
		else{
			var query_url = "/api/v1/get-testable-videos/from-MAL"
			var r = new XMLHttpRequest();
			r.open("POST", query_url, false);  // async: false
			r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			r.send(`MAL_username=${username}`); // backticks are required for string interpolation to work
		}

		if (r.status != 200) {
			console.log("Could not load your animelist : got status ", r.status, " with content : ", r.response)
			return -1
		}
		else {
			let user_data = JSON.parse(r.response)

			this.animelist = user_data["user_animelist"]
			this.animelist_availability = user_data["animelist_availability"]
			this.testable_animes = user_data["testable_animes"]
			this.testable_videos = new IndexedVideoList(user_data["testable_videos"])
		}
	}

	this.has_seen = function(anime) {
		return this.testable_animes.find(cur_anime => cur_anime == anime) !== undefined
	}
}

Vue.component('player-component', {
	props: ['player', 'small'],
	template: `<span class="player_card" :class="this.small ? 'small' : ''">{{ player.username[0] }}</span>`,
	methods: {
	}
})

Vue.component('player-list-component', {
	props: ['players'],
	template: `
		<div>
			<player-component v-for="cur_player in players"
							  v-bind:player="cur_player"
							  v-bind:key="cur_player.username">
			</player-component>
		</div>
	`
})
