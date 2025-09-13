import os
from pymongo import MongoClient


def get_client():
    uri = os.getenv('MONGODB_URI', 'mongodb+srv://test:test@cluster0.l3ladts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    return MongoClient(uri)


def get_db(name='hophacks'):
    client = get_client()
    return client[name]
