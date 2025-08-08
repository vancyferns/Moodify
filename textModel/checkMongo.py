from pymongo import MongoClient
import certifi  # This ensures SSL certificates are valid

# MongoDB connection string
MONGO_URI = "mongodb+srv://soniyavitkar2712:soniya_27@cluster0.slai2ew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect using certifi's CA bundle
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Access database and collection
db = client["moodify_db"]
collection = db["songs_by_emotion"]

# Function to fetch songs by emotion
def get_songs_by_emotion(emotion):
    results = collection.find({"emotion": emotion})
    return list(results)

# Main
if __name__ == "__main__":
    emotion = input("Enter an emotion (e.g. happy, sad, angry): ")
    songs = get_songs_by_emotion(emotion)
    for song in songs:
        print(song)
