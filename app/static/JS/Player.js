function Player(username) {
	this.username = username

	this.animelist = undefined
	this.animelist_availability = undefined
	this.testable_animes = undefined
	this.testable_videos = undefined

	this.load_user_data = function() {
		console.log("Retrieving user anime data for user", this.username)

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

			this.animelist = user_data["user_animelist"]
			this.animelist_availability = user_data["animelist_availability"]
			this.testable_animes = user_data["testable_animes"]
			this.testable_videos = user_data["testable_videos"]
		}
	}
}
