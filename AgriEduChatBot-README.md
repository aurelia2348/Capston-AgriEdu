🌾 AgriEdu Chatbot API
AgriEdu is a conversational AI API designed to assist users with agricultural education topics. Built with FastAPI, it uses a TensorFlow Lite model for intent classification and NLTK for natural language processing.

🚀 Features
Predicts user intent using a trained TFLite model.

Preprocessed NLP with NLTK (lemmatization, tokenization).

API endpoints for chatting, health check, and listing available intents.

Graceful error handling and logging.

CORS enabled for easy frontend integration.

🧠 Tech Stack
FastAPI – Lightweight, high-performance API framework

TensorFlow Lite – Lightweight model inference

NLTK – Natural Language Toolkit for NLP preprocessing

Pickle – For loading model data

Uvicorn – ASGI server for running FastAPI

📂 Project Structure
graphql
Copy
Edit
.
├── main.py # Main FastAPI app
├── chatbot_model.tflite # Trained TensorFlow Lite model
├── intents_processed.pkl # Processed intents (dictionary or list)
├── words.pkl # Preprocessed vocabulary
├── classes.pkl # Target class labels
└── README.md
🧪 Requirements
Python 3.8+

TensorFlow

FastAPI

Uvicorn

NLTK

NumPy

Install all dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Or manually:

bash
Copy
Edit
pip install fastapi uvicorn tensorflow nltk numpy
🔁 First-time Setup
Download required NLTK corpora:

python
Copy
Edit
import nltk
nltk.download('punkt')
nltk.download('wordnet')
▶️ Run the API
Start the FastAPI server using Uvicorn:

bash
Copy
Edit
uvicorn main:app --reload
Visit API docs at: http://localhost:8000/docs

Health check: GET /api/v1/health

Chat: POST /api/v1/chat

Get all intents: GET /api/v1/intents

📤 Example Request
POST /api/v1/chat
json
Copy
Edit
{
"message": "Hello, how can you help me with agriculture?"
}
Response
json
Copy
Edit
{
"response": "Sure, I can help you with crop rotation and soil improvement tips!"
}

## 📚 API Endpoints

### Base URL

```
https://chatbot-agriedu-production-aa60.up.railway.app
```

### Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

### Rate Limiting

The API has a rate limit of 100 requests per minute per IP address.

### Available Endpoints

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| GET    | `/`               | Check API status                        |
| GET    | `/api/v1/health`  | Check system health and model status    |
| POST   | `/api/v1/chat`    | Send messages to the chatbot            |
| GET    | `/api/v1/intents` | Get all available intents and responses |

### Detailed Endpoint Documentation

#### 1. Check API Status

```http
GET /
```

**Purpose:** Verify if the API is running and accessible.

**Response:**

```json
{
  "message": "AgriEdu Chatbot API is running"
}
```

**Status Codes:**

- `200 OK`: API is running normally
- `502 Bad Gateway`: API is not responding

#### 2. System Health Check

```http
GET /api/v1/health
```

**Purpose:** Verify the status of all API components including model files, NLTK data, and TensorFlow Lite interpreter.

**Response:**

```json
{
  "status": "healthy",
  "model_status": "loaded",
  "nltk_status": "ready",
  "words_count": 1661,
  "classes_count": 747,
  "intents_count": 754,
  "files_status": {
    "intents_processed.pkl": true,
    "words.pkl": true,
    "classes.pkl": true,
    "chatbot_model.tflite": true
  }
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| status | string | Overall API health status |
| model_status | string | Status of the TensorFlow Lite model |
| nltk_status | string | Status of NLTK components |
| words_count | integer | Number of words in vocabulary |
| classes_count | integer | Number of intent classes |
| intents_count | integer | Number of available intents |
| files_status | object | Status of each model file |

**Status Codes:**

- `200 OK`: All components are healthy
- `500 Internal Server Error`: One or more components failed to load

#### 3. Chat with Bot

```http
POST /api/v1/chat
```

**Purpose:** Send messages to the chatbot and get responses.

**Request Body:**

```json
{
  "message": "Your question or message here"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | The user's input message |

**Response:**

```json
{
  "response": "Bot's response to your message"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| response | string | The chatbot's response |

**Example Requests:**

1. Greeting:

```json
// Request
{
    "message": "Hello, how are you?"
}
// Response
{
    "response": "Hello! I'm AgriEdu Bot, ready to help you with agricultural topics!"
}
```

2. Agriculture Question:

```json
// Request
{
    "message": "What are the best practices for organic farming?"
}
// Response
{
    "response": "Organic farming best practices include crop rotation, natural pest control, and soil enrichment through composting. Would you like to know more about any specific aspect?"
}
```

**Status Codes:**

- `200 OK`: Message processed successfully
- `400 Bad Request`: Invalid or empty message
- `500 Internal Server Error`: Model processing error

#### 4. Get All Intents

```http
GET /api/v1/intents
```

**Purpose:** Retrieve all available intents, patterns, and responses used by the chatbot.

**Response:**

```json
[
  {
    "tag": "greeting",
    "patterns": ["Hi", "Hello", "Hey", "Good morning", "Good afternoon"],
    "responses": [
      "Hello! How can I help you with agriculture today?",
      "Hi there! What would you like to know about farming?",
      "Hey! I'm here to help with your agricultural questions!"
    ]
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| tag | string | Unique identifier for the intent |
| patterns | array | List of example phrases that trigger this intent |
| responses | array | List of possible responses for this intent |

**Status Codes:**

- `200 OK`: Intents retrieved successfully
- `500 Internal Server Error`: Error loading intents

### Error Handling

#### 400 Bad Request

```json
{
  "response": "Please enter a message."
}
```

**Occurs when:**

- Empty message is sent
- Invalid JSON format
- Missing required fields

#### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "detail": "Error message details"
}
```

**Occurs when:**

- Model loading fails
- NLTK data is missing
- Processing error occurs

### Testing Examples

#### Using cURL

1. Health Check:

```bash
curl -i https://chatbot-agriedu-production.up.railway.app/api/v1/health
```

2. Chat:

```bash
curl -i -X POST https://chatbot-agriedu-production.up.railway.app/api/v1/chat \
-H "Content-Type: application/json" \
-d '{"message": "Hello, what can you tell me about agriculture?"}'
```

3. Get Intents:

```bash
curl -i https://chatbot-agriedu-production.up.railway.app/api/v1/intents
```

#### Using Python Requests

```python
import requests

BASE_URL = "https://chatbot-agriedu-production.up.railway.app"

# Health Check
response = requests.get(f"{BASE_URL}/api/v1/health")
print(response.json())

# Chat
response = requests.post(
    f"{BASE_URL}/api/v1/chat",
    json={"message": "Hello, what can you tell me about agriculture?"}
)
print(response.json())

# Get Intents
response = requests.get(f"{BASE_URL}/api/v1/intents")
print(response.json())
```

### Best Practices

1. Always check the health endpoint before making chat requests
2. Handle rate limiting by implementing exponential backoff
3. Cache responses for frequently asked questions
4. Implement proper error handling for all possible status codes

📄 License
MIT License © 2025 — Your Name or Organization
