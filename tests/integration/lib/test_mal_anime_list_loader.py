# coding: utf8

from unittest import TestCase

from app.lib.mal_anime_list_loader import MALAnimeListLoader


class TestMALAnimeListLoader(TestCase):

    def test_get_anime_list(self):
        animelist = MALAnimeListLoader.get_anime_list("sindarus")
        self.assertIsInstance(animelist, list)
