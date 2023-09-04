import sys

sys.path.append("..")

import time
from queue import Queue

from flask import Flask, request, jsonify
from sqlalchemy import text

import settings
import database
from database import db_session
from model import model
from crawler.amazon_crawler import AmazonCrawlerThread
from src.utils import get_headers

app = Flask(__name__)
app.config.update({"DATABASE": settings.db_path})
database.init_db()
q = Queue(settings.queue_maxsize)

# running amazon craler in the background
crawler = AmazonCrawlerThread(queue=q, headers=get_headers(), debug=settings.debug)
crawler.start()


class APIError(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["message"] = self.message
        return rv


@app.errorhandler(APIError)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/collect_user_history", methods=["POST"])
def collect_user_history():
    content_type = request.headers.get("Content-Type")
    if content_type == "application/json":
        request_json = request.json
        url = request_json.get("url", "")
        if url == "":
            raise APIError("No url provided!")
        user_brower_time = request_json.get("user_brower_time", time.time())

        if q.full():
            raise APIError("Local Global Queue is full!")

        q.put({"url": url, "user_brower_time": user_brower_time, "n_try": 0})

        return jsonify({"message": "ok"})
    else:
        raise APIError("Content-Type not supported!")


@app.route("/get_recent_record", methods=["POST"])
def get_recent_record():
    with database.engine.connect() as con:
        records = con.execute(
            text(
                """
                select
                    *
                from
                    (
                        select
                            id,
                            url,
                            time_created,
                            item_id
                        from
                            (
                                select
                                    *
                                from
                                    amazon_user_history_record
                                order by
                                    time_created desc
                            )
                        group by
                            item_id
                    )
                where
                    1 = 1
                order by
                    time_created desc
                limit
                    5
                """
            )
        )

        response_body = {"records": [], "items": []}
        for record in records:
            response_body["records"].append({"id": record.id, "time_created": record.time_created, "url": record.url})
            item = database.db_session.query(model.AmazonItem).where(model.AmazonItem.id == record.item_id).all()
            if len(item) > 0:
                response_body["items"].append(
                    {
                        # "product_title": item[0].product_title,
                        "brand": item[0].brand,
                        "model_name": item[0].model_name,
                        "url": item[0].url
                    }
                )

    return jsonify(response_body)


if __name__ == "__main__":
    app.run(port=8000)
