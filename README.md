# Smart Excel<>JSON Parser

This is a full-stack application that allows seamless conversion between Excel files and JSON format. The app includes automatic schema detection and the ability to export JSON back to a structured Excel file.

---

## Features
✅ Convert Excel files to JSON with automatic schema detection  
✅ Convert JSON data back to Excel format  
✅ Clean and intuitive UI using Material-UI  
✅ Proper validation and error handling  
✅ Easily configurable API endpoints  
✅ Unit Tests for core functionalities  

---

## Tech Stack
- **Frontend:** React, Material-UI, Axios
- **Backend:** Java, Spring Boot
- **Deployment:** Docker

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Docker** (if deploying with containers)

---

## Setup Instructions
### 1. Clone the Repository
```bash
git clone <repository-url>
cd excel-json-parser-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

### 4. Start the Application
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Backend Setup (Optional for Full Stack)
Ensure your backend is running at the specified `API_BASE_URL`.

---

## Testing
To run the test cases:
```bash
npm test
```

---

## Build for Production
To generate a production build:
```bash
npm run build
```

---

## Docker Instructions
### Build Docker Image
```bash
docker build -t excel-json-parser .
```

### Run Docker Container
```bash
docker run -p 3000:3000 excel-json-parser
```

---

## Folder Structure
```
├── /src
│   ├── /components
│   │   ├── ExcelToJson.js
│   │   ├── JsonToExcel.js
│   ├── App.js
│   ├── index.js
│   ├── config.js
│   ├── App.css
│   └── index.css
├── .env
├── Dockerfile
├── package.json
├── README.md
└── ...
```

---

## Contact
For queries or support, contact **Prithviraj**. 😊

