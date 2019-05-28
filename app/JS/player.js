function Player(username) {
	this.username = username

	this.animelist = undefined
	this.animelist_availability = undefined
	this.testable_animes = undefined
	this.testable_videos = undefined

	this.load_user_data = async function() {
		console.log("Retrieving user anime data for user", this.username)

		if (MOCK_MODE){
			var r = {
				ok: true,
				status: 200,
				content: JSON.stringify(MOCKED_API_RESPONSE)
			};
			return this._handle_api_response(r);
		}
		else{
			var r = await window.fetch("/api/v1/get-testable-videos/from-MAL", {
				method: 'POST',
				body: `MAL_username=${this.username}`,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			r.content = await r.text();

			return this._handle_api_response(r)
		}
	}

	this._handle_api_response = async function(r) {
		if (!r.ok) {
			console.log("user animelist could not be loaded : got status ", r.status, " with content : ", r.content)
			throw "Could not load user data";
		}

		try{
			var user_data = JSON.parse(r.content);
		}
		catch (e){
			console.log("Got error while loading API response: ", r.conent);
			throw e;
		}

		this.animelist = user_data["user_animelist"]
		this.animelist_availability = user_data["animelist_availability"]
		this.testable_animes = user_data["testable_animes"]
		this.testable_videos = new IndexedVideoList(user_data["testable_videos"])
	}

	this.has_seen = function(anime) {
		return this.testable_animes.find(cur_anime => cur_anime == anime) !== undefined
	}
}
