import os
from pprint import pprint
from db import get_db
from data.mock_data import mock_users, mock_posts, mock_connections, mock_games


def seed(uri=None, dbname='hophacks'):
    db = get_db(name=dbname)
    # clear existing collections for a clean seed
    print('Clearing existing collections...')
    for col in ['users', 'posts', 'connections', 'games', 'likes', 'comments', 'shares']:
        try:
            db[col].delete_many({})
        except Exception:
            pass

    print('Seeding users...')
    if mock_users:
        res = db.users.insert_many([u.copy() for u in mock_users])
        print('Inserted users:', len(res.inserted_ids))

    print('Seeding posts...')
    if mock_posts:
        res = db.posts.insert_many([p.copy() for p in mock_posts])
        print('Inserted posts:', len(res.inserted_ids))

    print('Seeding connections...')
    if mock_connections:
        res = db.connections.insert_many([c.copy() for c in mock_connections])
        print('Inserted connections:', len(res.inserted_ids))

    print('Seeding games...')
    if mock_games:
        res = db.games.insert_many([g.copy() for g in mock_games])
        print('Inserted games:', len(res.inserted_ids))

    print('\nSample data from users collection:')
    pprint(list(db.users.find().limit(5)))


if __name__ == '__main__':
    # Optionally accept MONGODB_URI and DB name from env
    dbname = os.getenv('MONGODB_DB', 'hophacks')
    seed()
