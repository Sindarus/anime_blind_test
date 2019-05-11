# coding: utf8

from unittest import TestCase

from flask import current_app as app, Flask

from lib.helpers import get_opmoe_video_list

app = Flask(__name__)

class TestHelpers(TestCase):

    def test_get_opmoe_video_list(self):
        with app.test_request_context():
            opmoe_video_list = get_opmoe_video_list()
            self.assertIsInstance(opmoe_video_list, dict)
