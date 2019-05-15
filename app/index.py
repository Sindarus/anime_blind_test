# coding: utf8

from flask import Flask, render_template, request, jsonify
from flask_assets import Environment
from webassets import Bundle

from app.lib.helpers import get_opmoe_video_list
from app.lib.mal_anime_list_loader import MALAnimeListLoader

app = Flask(__name__)

assets = Environment(app)
assets.url = app.static_url_path
scss_bundle = Bundle('SCSS/index.scss', filters='pyscss', output='CSS/index.css')
assets.register('scss_all', scss_bundle)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/get-testable-videos/from-MAL', methods=['POST'])
def get_testable_videos_from_mal():
    mal_username = request.form['MAL_username']

    animelist = MALAnimeListLoader.get_anime_list(mal_username)
    app.logger.debug("user animelist : {}".format(animelist))

    opmoe_video_list = get_opmoe_video_list()

    animelist_availability = MALAnimeListLoader.get_animelist_availability(
        animelist, opmoe_video_list
    )

    testable_videos = {
        opmoe_name: opmoe_video_list[opmoe_name]
        for mal_name, opmoe_name in animelist_availability.items()
        if opmoe_name is not None
    }

    response_dict = {
        "user_animelist": animelist,
        "animelist_availability": animelist_availability,
        "testable_animes": list(testable_videos.keys()),
        "testable_videos": testable_videos
    }

    return jsonify(response_dict)
