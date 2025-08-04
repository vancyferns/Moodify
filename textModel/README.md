# Text Emotion Detection API

This is a Flask-based API that uses a pre-trained transformer model to detect emotions from text.

## How to Run

### 1. Prerequisites

Make sure you have Python 3 and `pip` installed on your system.

### 2. Create a Virtual Environment (Recommended)

It's a good practice to create a virtual environment to manage project dependencies.

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

Install the required Python packages using `pip`:

```bash
pip install -r requirements.txt
```

### 4. Run the Application

Once the dependencies are installed, you can run the Flask application:

```bash
#first run the fix_nlkt.py file
python fix_nltk.py
#once this is succesfull run app.py now you can run /client code in seperate terminal with npm run dev and go to emotionQuestionnare

python app.py
```

