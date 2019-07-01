//Mocking options
MOCK_MODE = true;
if(window.location.hostname !== "localhost"){
	MOCK_MODE = false;
}
MOCKED_API_RESPONSE = {
	user_animelist: ["Macross Delta", "Nichijou + a very long anime name that takes up multiple lines"],
	animelist_availability: {
		"Macross Delta": "Macross Delta",
		"Nichijou + a very long anime name that takes up multiple lines": "Nichijou + a very long anime name that takes up multiple lines"
	},
	testable_animes: ["Macross Delta", "Nichijou + a very long anime name that takes up multiple lines"],
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
		"Nichijou + a very long anime name that takes up multiple lines": [
			{
				"title": "Opening 1a",
				"source": "Nichijou + a very long anime name that takes up multiple lines",
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
