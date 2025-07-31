# SmartFile Q&A Setup Guide

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- OpenAI API key
- Gmail email and app password (for sending emails)
- Firebase service account JSON (for file storage)
- [ChromaDB](https://docs.trychroma.com/) (for vector storage)

---

## 1. Environment Variables
Create a `.env` file in your backend directory with the following:

```
OPENAI_API_KEY=your-openai-api-key-here
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

---

## 2. Firebase Service Account

Place your Firebase service account JSON file in the backend directory as `firebase-service-account.json`.

Example structure:
```
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  ...
}
```

---

## 3. Start the Backend

From the backend directory, run:

```
node app.js
```

This will start the Node.js backend server (default: http://localhost:3000).

---

## 4. Start ChromaDB

If you use Chroma for vector storage, start it with:

```
chroma run --host 0.0.0.0 --port 8000
```

---

## 5. Start the Frontend

Open `index.html` in the `smartfileUI` folder using a Live Server extension (such as VS Code Live Server) or any static server.

- In VS Code, right-click `index.html` and select **Open with Live Server**.
- Or use a static server like:
  ```
  npx serve .
  ```

---

## 6. Usage
- Upload a file and enter your email to start a conversation.
- Ask questions and upload more files in the chat.
- Export the conversation to PDF and receive it via email.

---

## Troubleshooting
- Ensure all API keys and credentials are correct.
- The backend and ChromaDB must be running for full functionality.
- For file preview, the backend must return a public file URL in the upload response.

---

Enjoy using SmartFile Q&A!
