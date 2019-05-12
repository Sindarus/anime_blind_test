# coding: utf8
import json
from unittest import TestCase

from app.lib.mal_anime_list_loader import MALAnimeListLoader


class TestMALAnimeListLoader(TestCase):

    def test_get_anime_list(self):
        animelist = MALAnimeListLoader.get_anime_list("sindarus")
        self.assertIsInstance(animelist, list)

    def test_nomarlize_name(self):
        with open("app/data/opmoe_to_MAL_map.json") as f:
            opmoe_to_mal_map = json.load(f)

        normalized_name = MALAnimeListLoader._normalize_name(
            anime_name="Boku dake ga Inai Machi",
            opmoe_to_mal_map=opmoe_to_mal_map
        )
        self.assertEqual("Boku dake ga Inai Machi (ERASED)", normalized_name)
