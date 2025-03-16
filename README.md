![github](https://img.shields.io/badge/GitHub-000000.svg?style=for-the-badge&logo=GitHub&logoColor=white)
![markdown](https://img.shields.io/badge/Markdown-000000.svg?style=for-the-badge&logo=Markdown&logoColor=white)

# 📚 ZapNotes

**ZapNotes** is a web application designed to provide chapter-wise notes and a quiz feature to help users test their progress. The app allows users to upload PDF files, extract chapter-wise notes, and take quizzes to assess their knowledge. The system leverages **Gemini** to assist in generating notes from the uploaded PDFs.

## 🌟 Features

- **📄 Chapter-wise Notes**: 
  - Users can upload PDF files for each chapter.
  - The system extracts the content and displays chapter-specific notes.
  
- **❓ Quiz Generation**: 
  - A quiz is randomly generated from the notes to help users test their understanding and progress.

- **🧠 Gemini Integration**: 
  - Gemini is utilized to assist in the extraction and generation of chapter-wise notes from the uploaded PDFs.

## 💻 Tech Stack

The project uses the following technologies:

- **Frontend**: 
  - 🔧 **React** – A JavaScript library for building user interfaces.
  
- **Backends**:
  - 🐍 **FastAPI** – For handling PDF uploads and extracting chapter-wise notes.
  - ⚡ **Express.js** – For generating and serving random quiz questions based on the extracted notes.

- **Other Tools**:
  - 🧠 **Gemini** – For content extraction and note generation from the uploaded PDFs.

## Project Setup

### Frontend (React)
The frontend is built using React, providing an intuitive UI for the users to upload PDF files and take quizzes.

#### Steps to Run Frontend:
1. Clone this repository.
    ```bash
   git clone https://github.com/hritesh-saha/ZapNotes.git
   ```
2. Change directory:
   ```bash
   cd ZapNotes
   ```
3. Enter Notes Directory:
   ```bash
   cd notes
   ```

### Backend 1 (FastAPI)
FastAPI is used for handling PDF uploads and extracting notes. It processes the PDFs and returns chapter-wise notes.

#### Steps to Run FastAPI Backend:
1. Enter FastAPI Backend Directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
### Backend 2 (Express)
Express handles quiz functionality. It generates random questions based on the notes and sends them to the frontend.

#### Steps to Run Express Backend:
1. Enter Express Backend Directory:
    ```bash
    cd NodeServer
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the Express server:
    ```bash
    npm start
    ```

## 🌍 Environment Variables

To run the **FastAPI** and **Express** backends, you need to set up the following environment variables:

### Required Environment Variables

1. **Gemini API Key**  
   This API key is required to interact with the Gemini service for extracting chapter-wise notes.

   ```bash
   GEMINI_API_KEY='your-gemini-api-key'
   ```
 2. **PORT**
    ```bash
    PORT='your-port-number'
    ```
<p align="center"><a href="https://github.com/hritesh-saha/ZapNotes/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=BSD-3-Clause&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a></p>

