# coding: utf8

from unittest import TestCase

import sys
from flask import current_app as app

from app.index import app


class FlaskAppTestCase(TestCase):

    def setUp(self):
        super().setUp()
        app.config['TESTING'] = True
        self.client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.__enter__()

    def tearDown(self):
        self.app_context.__exit__(*sys.exc_info())
        super().tearDown()
