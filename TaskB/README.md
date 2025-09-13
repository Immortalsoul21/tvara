# Gemini API Server

Minimal Express.js server with Gemini 2.0 Flash API integration.

## Setup

```bash
npm install
npm start
```

## Endpoints

- `POST /ask-gemini` - Send prompts to Gemini API
- `GET /health` - Server health check

## Usage

Send POST request to `/ask-gemini`:
```json
{
  "prompt": "Your question here"
}
```

Response:
```json
{
  "success": true,
  "response": "Gemini's response"
}
```
Note:

To implement the authentication put your api key in env file
