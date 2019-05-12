# coding: utf8
import json

from flask import Response

from tests.lib.flask_app_test_case import FlaskAppTestCase


class TestHelpers(FlaskAppTestCase):

    def test_get_opmoe_video_list(self):
        res = self.client.post(
            "/api/v1/get-testable-videos/from-MAL",
            data={"MAL_username": "sindarus"}
        ) # type: Response
        self.assertEqual(200, res.status_code)

        content = json.loads(res.data)
        self.assertEqual(type({}), type(content))
