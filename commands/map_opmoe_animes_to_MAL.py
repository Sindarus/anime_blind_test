# coding: utf8
import json
from datetime import datetime
from time import sleep
from urllib.parse import urlencode

from shutil import copy2

import requests


def mapping_done_for_anime(all_mappings, opmoe_name):
    res = list(filter(
        lambda mapping: anime_name_equal(mapping["opmoe_name"], opmoe_name),
        all_mappings
    ))
    if len(res) > 1:
        log("WARNING: There is more than one mapping for {anime}. Map is corrupt.".format(anime=opmoe_name))
        return True
    return len(res) == 1


def anime_name_equal(name_1, name_2):
    return name_1.lower() == name_2.lower()


def get_mapping_for_anime(opmoe_name):
    # Call Jikan API
    qs = urlencode({"q": opmoe_name})
    http_search_res = requests.get("https://api.jikan.moe/v3/search/anime?" + qs)
    if http_search_res.status_code != 200:
        log("Could not search anime {anime}, got HTTP {code}.".format(
            anime=opmoe_name, code=http_search_res.status_code
        ))
        return None
    search_results = json.loads(http_search_res.text)["results"]

    if len(search_results) > 0:
        # Look for a perfect match
        perfect_matches = list(filter(
            lambda search_res_elt: anime_name_equal(search_res_elt["title"], opmoe_name),
            search_results
        ))
        if len(perfect_matches) > 0:
            return {
                "opmoe_name": opmoe_name,
                "mal_name": perfect_matches[0]["title"],
                "mal_id": perfect_matches[0]["mal_id"],
                "_map_origin": "exact_name_match"
            }
        else:
            return {
                "opmoe_name": opmoe_name,
                "mal_name": search_results[0]["title"],
                "mal_id": search_results[0]["mal_id"],
                "_map_origin": "first_search_result_on_mal"
            }
    else:
        log("No search results for anime '{anime}'".format(anime=anime_name))
        return None


def iso_cur_date():
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")


def log(msg):
    print(iso_cur_date() + ": " + msg)


def backup_map():
    backup_filename = "backup/{date}_opmoe_to_MAL_map.json".format(
        date=iso_cur_date()
    )
    copy2("app/data/opmoe_to_MAL_map.json", backup_filename)


if __name__ == "__main__":
    log("Reading cached_opmoe_video_list.json")
    with open("app/data/cached_opmoe_video_list.json") as f:
        opmoe_video_list = json.loads(f.read())

    filter(lambda x: x["fsd"] == "dfsq")

    n_animes = len(list(opmoe_video_list.keys()))

    step = 100
    sleep_time = 10
    for i_start in range(0, n_animes, step):
        i_stop = min(i_start + step, n_animes)

        log("Backing up opmoe_to_MAL_map.json")
        backup_map()

        log("Reading opmoe_to_MAL_map.json")
        with open("app/data/opmoe_to_MAL_map.json", 'r+') as f:
            opmoe_to_MAL_map = json.loads(f.read())

        log("Starting to process animes")
        for anime_name in list(opmoe_video_list.keys())[i_start:i_stop]:
            if not mapping_done_for_anime(opmoe_to_MAL_map, anime_name):
                new_mapping = get_mapping_for_anime(anime_name)
                if new_mapping is not None:
                    opmoe_to_MAL_map.append(new_mapping)
                    log("Created mapping for anime '{anime}' (mal id: {mal_id}) : {method}.".format(
                        anime=anime_name, mal_id=new_mapping["mal_id"], method=new_mapping["_map_origin"]))
                sleep(sleep_time)
            else:
                log("Mapping for anime '{anime}' is already done.".format(
                    anime=anime_name
                ))

        log("Writing opmoe_to_MAL_map.json")
        with open("app/data/opmoe_to_MAL_map.json", 'w') as f:
            f.write(json.dumps(opmoe_to_MAL_map, indent=2))
