# API for user authenticated endpoints
# Note: none of these endpoints should have a user_id or user_email parameter passed in via the request.
# the user_id and user_email is obtained from the JWT, if valid
import io
import json
import logging
from datetime import datetime as dt
from http import HTTPStatus
import numpy as np
import pytz
import shortuuid
from flask import Blueprint
from flask import current_app as app
from flask import jsonify, request
from peewee import IntegrityError, DoesNotExist
from playhouse.shortcuts import model_to_dict

from core.auth.decorators import user_only
from core.models import Enrollments
from core.models import Studies

tz = pytz.timezone("Europe/London")
user_api = Blueprint("user_api", __name__)
logger = logging.getLogger(__name__)


# An example user authenticated endpoint.
@user_api.route("/user", methods=["GET"])
@user_only
def get_user(user_id, user_email):
    return jsonify(user_id)


@user_api.route("/enrollments", methods=["GET"])
@user_only
def get_user_enrollments(user_id, user_email):
    enrollments = Enrollments.select().where(Enrollments.user == user_id)

    return jsonify(
        [
            {
                "id": enrollment.id,
                "study_id": enrollment.study_id,
                "completed": enrollment.completed,
            }
            for enrollment in enrollments
        ]
    )


# I would normally use the same route to add or delete an enrollment (using different HTTP verbs)
# However, I noticed in the production website that the 'enroll/unenroll' pattern is used,
# so I stuck with the same pattern for conformity. In a real world scenario I would confirm with the team.


@user_api.route("/studies/<study_id>/enroll", methods=["POST"])
@user_only
def create_enrollment(user_id, user_email, study_id):
    try:
        enrollment = Enrollments.create(user=user_id, study=study_id)

        res = {
            "id": enrollment.id,
            "study_id": enrollment.study_id,
            "completed": enrollment.completed,
        }
        return jsonify(res), HTTPStatus.CREATED

    except IntegrityError as e:
        # If the user is already enrolled, due to the unique constraint,
        # the database will raise an IntegrityError
        msg = "User is already enrolled in this course"
        return jsonify(error=msg), HTTPStatus.CONFLICT  # 409 http code


@user_api.route("/studies/<study_id>/unenroll", methods=["DELETE"])
@user_only
def delete_enrollment(user_id, user_email, study_id):
    try:
        enrollment = (
            Enrollments.select()
            .where(
                (Enrollments.study_id == study_id) & (Enrollments.user_id == user_id)
            )
            .get()
        )
        enrollment.delete_instance()
        return jsonify(success=True)
    except DoesNotExist as e:
        msg = "User is not enrolled in the given study"
        return jsonify(error=msg), HTTPStatus.BAD_REQUEST
        # I am returning an 'error' key to match the client error handling (Axios interceptor)
