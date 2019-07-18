# coding: utf8
import json

import requests

from app.lib.helpers import anime_name_equal

TESTABLE_MAL_MEDIA_TYPES = ["TV", "OVA", "ONA"]


class MALAnimeListLoader(object):

    @staticmethod
    def get_anime_list(mal_username):
        # 'status=2' mean 'Completed'
        url = "https://myanimelist.net/animelist/{username}/load.json?status=2".format(
            username=mal_username)
        animelist_res = requests.get(url)

        if animelist_res.status_code != 200:
            raise AssertionError("Could not load user animelist at url {url}. "
                                 "Got HTTP{code} with content: {content} ".format(
                url=url,
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

    @staticmethod
    def get_animelist_availability(animelist, opmoe_video_list):
        """Returns a dict like {
            "mal_anime_name": "opmoe_anime_name", # if anime is available on opmoe
            "mal_anime_name": None                # if anime is not available
        }"""
        with open("app/data/opmoe_to_MAL_map.json") as f:
            opmoe_to_mal_map = json.load(f)

        animelist_availability = {}
        for anime in animelist:
            normalized_name = MALAnimeListLoader._normalize_name(anime, opmoe_to_mal_map)
            if normalized_name in opmoe_video_list:
                animelist_availability[anime] = normalized_name
            else:
                animelist_availability[anime] = None
        return animelist_availability

    @staticmethod
    def _normalize_name(anime_name, opmoe_to_mal_map):
        """From a MAL anime name, try to find the matching opmoe name."""
        matching_mal_animes = filter(
            lambda mapping_elt: anime_name_equal(mapping_elt["mal_name"], anime_name),
            opmoe_to_mal_map
        )
        sorted_matching_mal_animes = sorted(
            matching_mal_animes,
            key=MALAnimeListLoader._get_mapping_confidance_value
        )

        if len(sorted_matching_mal_animes) > 0:
            return sorted_matching_mal_animes[0]["opmoe_name"]
        else:
            return anime_name

    @staticmethod
    def _get_mapping_confidance_value(mapping):
        if mapping["_map_origin"] == "hand_added":
            return 0
        elif mapping["_map_origin"] == "exact_match":
            return 1
        elif mapping["_map_origin"] == "first_search_result_on_mal":
            return 2
        else:
            return 3

    @staticmethod
    def get_profile_picture_url(mal_username):
        url = "https://api.jikan.moe/v3/user/{username}".format(
            username=mal_username)
        profile_res = requests.get(url)

        profile = json.loads(profile_res.text)

        return profile.get("image_url")
