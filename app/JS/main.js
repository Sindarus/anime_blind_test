//Mocking options
MOCK_MODE = false;
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

//App options
var MUSIC_FADING_TIME_S = 3;
var linear_easing = x => x
var logarithmic_easing = a => (t => (Math.exp(-a*t)-1)/(Math.exp(-a)-1))
var exponential_easing = a => (t => (Math.exp(a*t)-1)/(Math.exp(a)-1))
var MUSIC_FADING_EASING = logarithmic_easing(2);
var VIDEO_CONTROLS = true;
