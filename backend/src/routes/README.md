# API Routes

- **POST /api/upload**: Upload a file, extract text, store metadata, chunk and embed, save to DB and ChromaDB.
- **POST /api/ask**: Ask a question about uploaded files in a conversation, returns an answer from OpenAI using relevant context.
- **POST /api/export**: Export a conversation (Q&A, files) to PDF and email it to the user.

All routes expect JSON bodies except file upload (multipart/form-data).

See controllers and services for implementation details.
