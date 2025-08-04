# Run this script to download required NLTK data
import nltk
import ssl

# Handle SSL certificate issues if they occur
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download required NLTK data
print("Downloading NLTK data...")

try:
    # Download the newer punkt_tab tokenizer
    nltk.download('punkt_tab')
    print("✓ punkt_tab downloaded successfully")
except:
    print("Failed to download punkt_tab, trying punkt...")
    try:
        nltk.download('punkt')
        print("✓ punkt downloaded successfully")
    except:
        print("Failed to download punkt tokenizer")

try:
    # Download stopwords
    nltk.download('stopwords')
    print("✓ stopwords downloaded successfully")
except:
    print("Failed to download stopwords")

print("NLTK setup complete!")

# Test the downloads
try:
    from nltk.tokenize import sent_tokenize
    from nltk.corpus import stopwords
    
    test_text = "Hello world. This is a test."
    sentences = sent_tokenize(test_text)
    stop_words = set(stopwords.words('english'))
    
    print(f"\nTesting tokenization:")
    print(f"Input: {test_text}")
    print(f"Sentences: {sentences}")
    print(f"Number of English stopwords: {len(stop_words)}")
    print("\n✓ All NLTK components working correctly!")
    
except Exception as e:
    print(f"\n❌ Error testing NLTK components: {e}")
    print("You may need to run the downloads manually in Python:")
    print(">>> import nltk")
    print(">>> nltk.download('punkt_tab')")
    print(">>> nltk.download('stopwords')")