# coding: utf8

from flask import Flask, render_template, request, jsonify

from app.lib.helpers import normalize_animelist, get_opmoe_video_list
from app.lib.mal_anime_list_loader import MALAnimeListLoader

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/get-testable-videos/from-MAL', methods=['POST'])
def get_testable_videos_from_mal():
    mal_username = request.form['MAL_username']

    animelist = MALAnimeListLoader.get_anime_list(mal_username)
    app.logger.debug("user animelist : {}".format(animelist))
    normalized_animelist = normalize_animelist(animelist)

    opmoe_video_list = get_opmoe_video_list()

    testable_videos_list = {
        anime: opmoe_video_list[anime]
        for anime in normalized_animelist if opmoe_video_list.get(anime) is not None
    }

    response_json = {
        "user_animelist": animelist,
        "testable_animes": list(testable_videos_list.keys()),
        "testable_videos": testable_videos_list
    }

    return jsonify(response_json)
