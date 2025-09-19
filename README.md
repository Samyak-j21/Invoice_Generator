# MERN Stack Invoice Generator
This is a full-stack web application for generating, saving, and managing professional invoices. The application is built using the MERN stack and includes features for handling Indian GST calculations.
## 🚀 Features
* **Create & Save Invoices**: Generate new invoices and save them to a MongoDB database.
* **Dynamic Item Table**: Add and edit line items with automatic total and tax calculations.
* **GST Calculation**: Automatically calculates CGST, SGST, or IGST based on the client's "Place of Supply."
* **Manual Tax Override**: Option to manually enter a tax amount.
* **PDF Generation**: Download a PDF version of the invoice from the frontend.
* **Invoice Retrieval**: View a list of all previously saved invoices.
## ⚙️ Technologies Used
### Frontend
* **React**: For building the user interface.
* **JS-PDF**: For client-side PDF generation.
### Backend
* **Node.js & Express**: To power the server and API.
* **MongoDB & Mongoose**: For the database to store invoice data.
* **CORS**: For handling cross-origin requests.
* **Dotenv**: To manage environment variables securely.
## 💻 Getting Started
Follow these steps to get the project up and running on your local machine.
### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas Account
### 1. Backend Setup
The backend server needs to be run first.
1.  Navigate into the `server` folder:
    ```bash
    cd server
    ```
2.  Install the backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` folder and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_atlas_connection_string
    ```
    Make sure there are no quotes around the connection string.
4.  Start the backend server:
    ```bash
    node server.js
    ```
    The server will run on `http://localhost:5000`.
### 2. Frontend Setup
The frontend app needs to be run in a separate terminal.
1.  Open a new terminal window and navigate to the `invoice-generator` root folder.
2.  Install the frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
    The app will open in your browser at `http://localhost:3000`.
## 📄 License

This project is licensed under the ISC License.
