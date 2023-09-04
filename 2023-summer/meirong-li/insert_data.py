from sqlalchemy import insert
from model import model
import database

items = [
    model.AmazonItem(brand="a1", model_name="a2"),
    model.AmazonItem(brand="b1", model_name="b2"),
    model.AmazonItem(brand="c1", model_name="c2"),
    model.AmazonItem(brand="d1", model_name="d2"),
    model.AmazonItem(brand="e1", model_name="e2"),
]

database.db_session.bulk_save_objects(items, return_defaults=True)
for item in items:
    print("id %s" % item.id)

database.db_session.commit()

records = [
    model.AmazonUserHistoryRecord(item_id=1),
    model.AmazonUserHistoryRecord(item_id=2),
    model.AmazonUserHistoryRecord(item_id=3),
    model.AmazonUserHistoryRecord(item_id=4),
    model.AmazonUserHistoryRecord(item_id=5),
]

database.db_session.bulk_save_objects(records, return_defaults=True)
for record in records:
    print("id %s" % record.id)

database.db_session.commit()
