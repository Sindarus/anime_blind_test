# coding: utf8

from unittest import TestCase

from flask import current_app as app, Flask

from app.lib.helpers import get_opmoe_video_list
from tests.lib.flask_app_test_case import FlaskAppTestCase


class TestHelpers(FlaskAppTestCase):

    def test_get_opmoe_video_list(self):
        opmoe_video_list = get_opmoe_video_list()
        self.assertIsInstance(opmoe_video_list, dict)
