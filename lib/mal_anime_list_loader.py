# coding: utf8
import json

import requests
from flask import make_response, jsonify

TESTABLE_MAL_MEDIA_TYPES = ["TV", "OVA", "ONA"]


class MALAnimeListLoader(object):

    @staticmethod
    def get_anime_list(mal_username):
        # 'status=2' mean 'Completed'
        url = "https://myanimelist.net/animelist/{username}/load.json?status=2".format(
            username=mal_username)
        animelist_res = requests.get(url)

        if animelist_res.status_code != 200:
            raise AssertionError("Could not load user animelist. "
                                 "Got HTTP{code} with content: {content} ".format(
                code=animelist_res.status_code,
                content=animelist_res.text
            ))

        anime_objs = json.loads(animelist_res.text)
        valid_anime_objs = list(filter(
            lambda anime: MALAnimeListLoader.is_valid_anime(anime),
            anime_objs
        ))
        return list(map(
            lambda anime: anime["anime_title"],
            valid_anime_objs
        ))

    @staticmethod
    def is_valid_anime(mal_anime_obj):
        return mal_anime_obj.get("anime_media_type_string") in TESTABLE_MAL_MEDIA_TYPES
