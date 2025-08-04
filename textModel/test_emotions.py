import requests
import json
import time

# --- Configuration ---
# The URL where your Flask API is running.
API_URL = "http://127.0.0.1:5001/predict"

# Define ANSI color codes for pretty printing in the terminal
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

# --- Expanded Test Data ---
# A comprehensive list of test cases to ensure model accuracy and robustness.
TEST_CASES = [
    # --- Group 1: Joy / Happiness ---
    {
        "name": "Joy: Obvious Success",
        "expected_emotion": ("joy", "happiness", "happy"),
        "responses": [
            "My project at work was a huge success and my boss was really pleased.",
            "I'm really looking forward to celebrating with my friends this weekend.",
            "I feel accomplished, joyful, and incredibly proud."
        ]
    },
    {
        "name": "Joy: Calm Contentment",
        "expected_emotion": ("joy", "happiness", "happy"),
        "responses": [
            "I spent the afternoon reading a good book in the garden.",
            "It was just a peaceful, lovely day. Nothing special, but I feel very content.",
            "Just feeling serene and happy with how things are."
        ]
    },
    {
        "name": "Joy: Excitement & Anticipation",
        "expected_emotion": ("joy", "happiness", "happy", "surprise"),
        "responses": [
            "I just booked my vacation for next month! I am so excited I can barely sit still.",
            "I can't wait to finally go on this trip, it's going to be an amazing adventure.",
            "Feeling thrilled and full of energy."
        ]
    },
    # --- Group 2: Sadness ---
    {
        "name": "Sadness: Obvious Loss",
        "expected_emotion": ("sadness", "sad"),
        "responses": [
            "I've been thinking about a friend I lost touch with. It feels a bit lonely.",
            "A little bit tired and drained, like I have no energy.",
            "Feeling down, melancholic, and a bit empty."
        ]
    },
    {
        "name": "Sadness: Disappointment",
        "expected_emotion": ("sadness", "sad", "disgust"),
        "responses": [
            "I didn't get the promotion I was hoping for. It's a major letdown.",
            "I feel physically heavy and just want to stay in bed.",
            "I'm just disappointed and feeling a bit worthless right now."
        ]
    },
    # --- Group 3: Anger ---
    {
        "name": "Anger: Obvious Frustration",
        "expected_emotion": ("anger", "angry"),
        "responses": [
            "Someone took credit for my work and it's incredibly frustrating.",
            "Tense, my jaw is clenched, and I feel hot-headed.",
            "I am annoyed, infuriated, and resentful."
        ]
    },
    {
        "name": "Anger: Irritation / Annoyance",
        "expected_emotion": ("anger", "angry", "disgust"),
        "responses": [
            "The internet has been down all day and I can't get any work done.",
            "My neighbor's dog has been barking for three hours straight.",
            "I'm just so irritated and on edge."
        ]
    },
    # --- Group 4: Fear / Anxiety ---
    {
        "name": "Fear: Obvious Worry",
        "expected_emotion": ("fear",),
        "responses": [
            "I have a huge deadline approaching and I'm worried I won't make it.",
            "My heart is racing and my stomach feels like it's in knots.",
            "I'm not looking forward to the review meeting tomorrow, I'm dreading it."
        ]
    },
    {
        "name": "Fear: General Anxiety",
        "expected_emotion": ("fear",),
        "responses": [
            "I have this unsettling feeling that something bad is about to happen.",
            "I feel restless and can't seem to focus on anything.",
            "There's just a sense of unease that I can't shake."
        ]
    },
    # --- Group 5: Surprise ---
    {
        "name": "Surprise: Positive Shock",
        "expected_emotion": ("surprise", "joy"),
        "responses": [
            "I got a call out of the blue with an amazing, unexpected job offer.",
            "I honestly can't stop thinking about that phone call. I never saw it coming.",
            "Absolutely shocked, amazed, and completely stunned."
        ]
    },
    {
        "name": "Surprise: Negative Shock",
        "expected_emotion": ("surprise", "fear", "sadness"),
        "responses": [
            "I just saw the news about the earthquake. I'm in total disbelief.",
            "I can't believe this is happening. It's shocking.",
            "My mind is just blank. I don't know what to feel."
        ]
    },
    # --- Group 6: Neutral ---
    {
        "name": "Neutral: Factual & Objective",
        "expected_emotion": ("neutral",),
        "responses": [
            "I went to the grocery store to buy milk and bread.",
            "The weather today is partly cloudy with a high of 25 degrees.",
            "My plan for the evening is to finish my report and then watch a movie."
        ]
    },
    {
        "name": "Neutral: Calm & Unemotional",
        "expected_emotion": ("neutral",),
        "responses": [
            "My day was standard. Nothing notable happened.",
            "I'm feeling neither good nor bad. Just existing.",
            "My mood is stable and calm."
        ]
    },
    # --- Group 7: Mixed / Complex Emotions ---
    {
        "name": "Mixed: Happy & Sad (Nostalgia)",
        "expected_emotion": ("sadness", "joy"),
        "responses": [
            "I was looking through old photos from college. It brought back so many happy memories.",
            "It makes me a little sad to think about how much time has passed.",
            "It's a bittersweet feeling, for sure."
        ]
    },
    {
        "name": "Mixed: Anxious & Excited",
        "expected_emotion": ("fear", "joy"),
        "responses": [
            "I'm starting a new job next week. I'm so excited for the opportunity.",
            "At the same time, I'm really nervous about meeting everyone and making a good impression.",
            "My stomach is doing flips, a mix of good and bad butterflies."
        ]
    }
]

def run_tests():
    """
    Runs all defined test cases against the emotion analysis API.
    """
    print(f"{Colors.BLUE}--- Starting Expanded Emotion API Test Suite ---{Colors.RESET}\n")
    success_count = 0
    total_tests = len(TEST_CASES)
    
    for i, test in enumerate(TEST_CASES):
        print(f"[{i+1}/{total_tests}] Testing for: {Colors.CYAN}{test['name']}{Colors.RESET}")
        
        payload = {
            "responses": test["responses"],
            "use_ensemble": True
        }
        
        try:
            # Send the POST request to the API
            response = requests.post(API_URL, json=payload, headers={'Content-Type': 'application/json'}, timeout=10)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

            result = response.json()
            primary_emotion = result.get("primary_emotion", "N/A").lower()
            confidence = result.get("confidence", 0)

            # Check if the result matches the expectation
            if primary_emotion in test["expected_emotion"]:
                print(f"  {Colors.GREEN}✔ SUCCESS{Colors.RESET}")
                success_count += 1
                print(f"  Expected one of: {test['expected_emotion']} -> Got: '{primary_emotion}' (Confidence: {confidence:.1%})")
            else:
                print(f"  {Colors.RED}✖ FAILURE{Colors.RESET}")
                print(f"  Expected one of: {test['expected_emotion']} -> But got: '{primary_emotion}' (Confidence: {confidence:.1%})")

            # Optional: Print all detected emotions for deeper analysis
            all_emotions = result.get("all_emotions", [])
            if all_emotions:
                emotion_summary = ", ".join([f"{e['emotion']}: {e['confidence']:.0%}" for e in all_emotions[:3]])
                print(f"  Top Detections: [{emotion_summary}]")
            
            print("-" * 50)

        except requests.exceptions.Timeout:
            print(f"  {Colors.RED}✖ ERROR: The request timed out.{Colors.RESET}")
            print(f"  The server at {API_URL} took too long to respond.")
            print("-" * 50)
            break
        except requests.exceptions.RequestException as e:
            print(f"  {Colors.RED}✖ ERROR: Could not connect to the API.{Colors.RESET}")
            print(f"  Please make sure your Flask server is running at {API_URL}")
            print(f"  Error details: {e}")
            print("-" * 50)
            break # Stop tests if the server is not reachable
        
        time.sleep(0.2) # Small delay to avoid overwhelming the server

    print(f"\n{Colors.BLUE}--- Test Suite Finished ---{Colors.RESET}")
    final_score = (success_count / total_tests) * 100 if total_tests > 0 else 0
    
    if final_score == 100:
        color = Colors.GREEN
    elif final_score >= 75:
        color = Colors.YELLOW
    else:
        color = Colors.RED
        
    print(f"Final Result: {color}{success_count}/{total_tests} tests passed ({final_score:.1f}%){Colors.RESET}")

if __name__ == "__main__":
    run_tests()
