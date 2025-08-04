import requests
import json

# --- Configuration ---
# The URL where your Flask API is running.
API_URL = "http://127.0.0.1:5001/predict"

# Define ANSI color codes for pretty printing in the terminal
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

# --- Test Data ---
# A list of test cases, each with a name, the expected result, and the input answers.
TEST_CASES = [
    {
        "name": "Joy / Happiness",
        "expected_emotion": ("joy", "happiness", "happy"), # Can be any of these
        "responses": [
            "My project at work was a huge success and my boss was really pleased.",
            "I'm really looking forward to celebrating with my friends this weekend.",
            "I feel accomplished, joyful, and incredibly proud."
        ]
    },
    {
        "name": "Sadness",
        "expected_emotion": ("sadness", "sad"),
        "responses": [
            "I've been thinking about a friend I lost touch with. It feels a bit lonely.",
            "A little bit tired and drained, like I have no energy.",
            "Feeling down, melancholic, and a bit empty."
        ]
    },
    {
        "name": "Anger",
        "expected_emotion": ("anger", "angry"),
        "responses": [
            "Someone took credit for my work and it's incredibly frustrating.",
            "Tense, my jaw is clenched, and I feel hot-headed.",
            "I am annoyed, infuriated, and resentful."
        ]
    },
    {
        "name": "Fear / Anxiety",
        "expected_emotion": ("fear",),
        "responses": [
            "I have a huge deadline approaching and I'm worried I won't make it.",
            "My heart is racing and my stomach feels like it's in knots.",
            "I'm not looking forward to the review meeting tomorrow, I'm dreading it."
        ]
    },
    {
        "name": "Surprise",
        "expected_emotion": ("surprise",),
        "responses": [
            "I got a call out of the blue with an amazing, unexpected job offer.",
            "I honestly can't stop thinking about that phone call. I never saw it coming.",
            "Absolutely shocked, amazed, and completely stunned."
        ]
    }
]

def run_tests():
    """
    Runs all defined test cases against the emotion analysis API.
    """
    print(f"{Colors.BLUE}--- Starting Emotion API Test Suite ---{Colors.RESET}\n")
    success_count = 0
    
    for i, test in enumerate(TEST_CASES):
        print(f"[{i+1}/{len(TEST_CASES)}] Testing for: {Colors.YELLOW}{test['name']}{Colors.RESET}")
        
        payload = {
            "responses": test["responses"],
            "use_ensemble": True
        }
        
        try:
            # Send the POST request to the API
            response = requests.post(API_URL, json=payload, headers={'Content-Type': 'application/json'})
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

            result = response.json()
            primary_emotion = result.get("primary_emotion", "N/A").lower()
            confidence = result.get("confidence", 0)

            # Check if the result matches the expectation
            if primary_emotion in test["expected_emotion"]:
                print(f"  {Colors.GREEN}✔ SUCCESS{Colors.RESET}")
                success_count += 1
            else:
                print(f"  {Colors.RED}✖ FAILURE{Colors.RESET}")

            print(f"  Expected: {test['expected_emotion']}")
            print(f"  Got: '{primary_emotion}' (Confidence: {confidence:.2%})")
            # print("  Full Response:", json.dumps(result, indent=2)) # Uncomment for full details
            print("-" * 40)

        except requests.exceptions.RequestException as e:
            print(f"  {Colors.RED}✖ ERROR: Could not connect to the API.{Colors.RESET}")
            print(f"  Please make sure your Flask server is running at {API_URL}")
            print(f"  Error details: {e}")
            print("-" * 40)
            break # Stop tests if the server is not reachable
            
    print(f"{Colors.BLUE}--- Test Suite Finished ---{Colors.RESET}")
    print(f"Result: {success_count}/{len(TEST_CASES)} tests passed.")

if __name__ == "__main__":
    run_tests()