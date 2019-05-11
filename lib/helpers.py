# coding: utf8
import json
from datetime import datetime

import requests
from flask import current_app as app

from settings import OPMOE_CACHE_VALIDITY_TIME, USE_FILE_CACHED_OPMOE_VIDEO_LIST

opmoe_video_list_cache = {
    "last_update": None,
    "cached_data": None
}


def normalize_animelist(animelist):
    # TODO: implement + rewrite the return stmt of get_testable_videos_from_mal
    return animelist


def get_opmoe_video_list():
    if USE_FILE_CACHED_OPMOE_VIDEO_LIST:
        app.logger.info("Using file cached opmoe video list")
        with open('cache/cached_opmoe_video_list.json') as f:
            return json.loads(f.read())
    if not is_opmoe_cache_still_valid():
        app.logger.info("Updating opmoe list cache.")
        update_opmoe_video_list_cache()
    return opmoe_video_list_cache["cached_data"]


def is_opmoe_cache_still_valid():
    if opmoe_video_list_cache["last_update"] is None:
        return False
    else:
        # noinspection PyTypeChecker
        return datetime.now() - opmoe_video_list_cache["last_update"] < OPMOE_CACHE_VALIDITY_TIME


def update_opmoe_video_list_cache():
    global opmoe_video_list_cache

    url = "https://openings.moe/api/list.php"
    unindexed_video_list_res = requests.get(url)
    if unindexed_video_list_res.status_code != 200:
        raise AssertionError("Could not load opmoe video list.")

    unindexed_video_list = json.loads(unindexed_video_list_res.text)
    indexed_video_list = index_unindexed_video_list(unindexed_video_list)

    opmoe_video_list_cache["cached_data"] = indexed_video_list
    opmoe_video_list_cache["last_update"] = datetime.now()


def index_unindexed_video_list(unindexed_video_list):
    indexed_video_list = {}
    for video in unindexed_video_list:
        if video["source"] in indexed_video_list:
            indexed_video_list[video["source"]].append(video)
        else:
            indexed_video_list[video["source"]] = [video]
    return indexed_video_list
