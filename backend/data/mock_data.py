from datetime import datetime, timedelta
import random

# Mock users data
mock_users = [
    {
        'id': 1,
        'username': 'john_doe',
        'email': 'john@example.com',
        'name': 'John Doe',
        'age': 42,
        'location': 'San Francisco, CA',
        'bio': 'Staying positive through my recovery journey. One day at a time!',
        'condition': 'Knee Replacement Surgery',
        'diagnosis_date': '2023-10-15',
        'hospital': 'General Hospital SF',
        'doctor': 'Dr. Emily Chen',
        'treatment': 'Physical therapy 3x/week, pain management',
        'medications': ['Ibuprofen', 'Acetaminophen', 'Vitamin D'],
        'progress': 'Week 6 of recovery - walking with cane',
        'goals': 'Return to hiking by summer 2024',
        'created_at': '2023-10-20T10:00:00'
    },
    {
        'id': 2,
        'username': 'sarah_k',
        'email': 'sarah@example.com',
        'name': 'Sarah K.',
        'age': 35,
        'location': 'New York, NY',
        'bio': 'Recovering from ACL surgery and staying motivated!',
        'condition': 'ACL Reconstruction',
        'diagnosis_date': '2023-09-10',
        'hospital': 'NYC Medical Center',
        'doctor': 'Dr. Michael Rodriguez',
        'treatment': 'Physical therapy, strength training',
        'medications': ['Naproxen', 'Calcium supplements'],
        'progress': 'Week 8 of recovery - light jogging',
        'goals': 'Return to soccer in 3 months',
        'created_at': '2023-09-15T14:30:00'
    }
]

# Mock posts data
mock_posts = [
    {
        'id': 1,
        'user_id': 2,
        'user': 'Sarah K.',
        'condition': 'ACL Reconstruction',
        'content': 'Today I managed to walk without crutches for the first time! So proud of this small victory in my recovery journey.',
        'likes': 12,
        'comments': 4,
        'time': '2 hours ago',
        'created_at': (datetime.now() - timedelta(hours=2)).isoformat()
    },
    {
        'id': 2,
        'user_id': 2,
        'user': 'Sarah K.',
        'condition': 'ACL Reconstruction',
        'content': 'Finding new ways to manage fatigue has been challenging but rewarding. Meditation and light stretching have helped tremendously.',
        'likes': 8,
        'comments': 3,
        'time': '5 hours ago',
        'created_at': (datetime.now() - timedelta(hours=5)).isoformat()
    }
]

# Mock connections data
mock_connections = [
    {
        'id': 1,
        'name': 'David R.',
        'condition': 'Knee Surgery Recovery',
        'journey': 'Week 3 of recovery',
        'location': 'New York, USA',
        'status': 'Similar journey',
    },
    {
        'id': 2,
        'name': 'Emma W.',
        'condition': 'Multiple Sclerosis',
        'journey': 'Managing symptoms for 2 years',
        'location': 'London, UK',
        'status': 'Can offer advice',
    },
    {
        'id': 3,
        'name': 'James P.',
        'condition': 'Cancer Remission',
        'journey': '6 months post-treatment',
        'location': 'Toronto, Canada',
        'status': 'Support mentor',
    }
]

# Mock games data
mock_games = [
    {
        'id': 1,
        'title': 'Memory Match',
        'description': 'Improve cognitive function with this memory matching game',
        'category': 'Alzheimer\'s/Cognitive',
        'difficulty': 'Easy',
        'image_url': 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ea9a6ac0-f3f7-4eb2-8823-7fae4477efcd.png'
    },
    {
        'id': 2,
        'title': 'Motion Therapy',
        'description': 'Gentle exercises for physical rehabilitation',
        'category': 'Physical Recovery',
        'difficulty': 'Adaptive',
        'image_url': 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5b6f78a4-72e6-4c87-942b-6c6a1de917dc.png'
    }
]