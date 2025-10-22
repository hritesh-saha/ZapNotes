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

To run the **FastAPI** backend and the **React** frontend, you need to set up the following environment variables:

### 🖥️ Backend (FastAPI)

 **Gemini API Key**  
   This API key is required to interact with the Gemini service for extracting chapter-wise notes.

   Create a `.env` file in the root of your FastAPI backend directory (e.g., `server/`) and add:

   ```bash
   GEMINI_API_KEY='your-gemini-api-key'
   ```
### 🖥️ Backend (Express) [Optional]

 **Gemini API Key**  
   This API key is required to interact with the Gemini service for extracting chapter-wise notes.

   Create a `.env` file in the root of your Express backend directory (e.g., `NodeServer/`) and add:

   ```bash
   GEMINI_API_KEY='your-gemini-api-key'
   ```
### 💻 Frontend (React - `notes` folder)

#### 🔗 Backend URL  
The frontend communicates with the FastAPI backend via this URL.

Create a `.env.local` file inside the `notes` directory and add:

```bash
VITE_BACKEND_URL=<your_backend_url>
```
For example, if you're running the backend locally on port 8000:

```bash
VITE_BACKEND_URL=http://localhost:8000
```
> ⚠️ **Note:** Make sure to restart the frontend development server after updating the `.env.local` file.


## 🐳 Dockerized Setup

The ZapNotes application is containerized using Docker for both the frontend and the FastAPI backend for easy setup and deployment.

### Docker Images

- Frontend image: `hriteshsaha4/zapnotes-frontend:dev`
- FastAPI backend image: `hriteshsaha4/zapnotes-backend:dev`

### Running with Docker Compose

You can run both the frontend and backend services together using the provided `docker-compose.yml` file.

#### Steps to Run via Docker Compose

1. Clone the repository if you haven't already:
    ```bash
    git clone https://github.com/hritesh-saha/ZapNotes.git
    cd ZapNotes
    ```

2. Make sure Docker and Docker Compose are installed on your system.

3. **Set your Gemini API Key in the `docker-compose.yml` file**:  
   Before running the containers, open the `docker-compose.yml` file and add your Gemini API key as an environment variable under the backend service. For example:

    ```yaml
    services:
      backend:
        image: hriteshsaha4/zapnotes-backend:dev
        container_name: zapnotes-backend
        ports:
          - "8000:8000"
        environment:
          - GEMINI_API_KEY=your_actual_key_here  # 👈 Set your backend env var here
        networks:
          - zapnet

    ```

4. From the root directory (where the `docker-compose.yml` file is located), run:
    ```bash
    docker-compose up -d
    ```

5. Once the containers start, open your browser and navigate to:
    ```
    http://localhost:5173
    ```
    This loads the ZapNotes frontend, which communicates with the FastAPI backend inside Docker.


### 🛑 Stopping the Application

To stop and remove the containers, run:
```bash
docker-compose down
```
### 📜 Viewing Logs (Optional)

To view live logs from the containers, run:

```bash
docker-compose logs -f
```
### 🔍 What `-f` Does:

- The `-f` flag stands for **"follow"**.
- It streams **real-time logs** from your running containers, similar to `tail -f`.
- Useful for debugging or monitoring application behavior live.

### 🕒 Without `-f`:

- Shows only **past logs** up to the point when the command is run.
- The command then **exits immediately**, without streaming further logs.

## 🛡️ Project Monitoring with SysGuardian

To ensure the reliability, security, and uptime of the deployed Zapnotes application, I am using a custom-built monitoring tool called **SysGuardian**.

This is a comprehensive Bash script that runs automatically on the EC2 server, performing regular health checks and security audits. It immediately alerts me to any potential issues by sending a full report as a push notification to my phone using `ntfy.sh`.

Key features of the `SysGuardian` script include:
* 📊 **Resource Monitoring:** Tracks CPU, memory, and disk usage against critical thresholds.
* 🔐 **Security Audits:** Analyzes `auth.log` for failed login attempts and flags unknown/suspicious IPs.
* 🌐 **Network Monitoring:** Lists all active TCP/UDP connections.
* ⏱️ **Uptime Checks:** Reports the server's current uptime and load average.

This proactive monitoring strategy ensures that any performance bottlenecks or security threats are identified and handled immediately.

You can view the `SysGuardian` project and its source code [in its own GitHub repository here](https://github.com/hritesh-saha/SysGuardian).


<p align="center"><a href="https://github.com/hritesh-saha/ZapNotes/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=BSD-3-Clause&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a></p>

