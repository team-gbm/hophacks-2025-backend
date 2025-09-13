import os
from pymongo import MongoClient


def get_client():
    uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    return MongoClient(uri)


def get_db(name='hophacks'):
    client = get_client()
    return client[name]
