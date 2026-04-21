
# 🌌 Exoplanet Detection & Habitability Prediction

This project uses Machine Learning to analyze astronomical data and perform:
- 🪐 Exoplanet Detection  
- 🌍 Habitability Prediction  

The system combines both models to identify whether a celestial object is an exoplanet and whether it could support Earth-like life.

---

# 🚀 Project Objective

- Detect whether a celestial object is an **exoplanet**
- Predict whether the exoplanet is **habitable**
- Build an end-to-end ML system with API + frontend

---

# 🧠 Machine Learning Models

## 🔹 Exoplanet Detection
- Dataset preprocessing
- Feature engineering
- Classification model (Logistic Regression / XGBoost / Random Forest)

## 🔹 Habitability Prediction
- Earth-like feature engineering
- Flux, temperature, and radius-based conditions
- XGBoost / Logistic Regression model
- Focus on reducing false positives in habitability detection

---

# 📁 Project Structure

```

project/
│
├── backend/
│   ├── main.py
│   ├── model files
│   └── ML pipeline code
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── UI components

````id="str1"

---

# 🚀 How to Run the Project

This project has two parts:
- 🐍 Backend (FastAPI)
- ⚛️ Frontend (React)

Run both separately.

---

# 🐍 Backend Setup

## 📌 Go to backend folder
```bash
cd backend
````

---

## 📌 Install dependencies (manual)

Since there is no `requirements.txt`:

```bash id="inst1"
pip install fastapi uvicorn pandas numpy scikit-learn xgboost
```

---

## 📌 Run backend

```bash id="run1"
uvicorn main:app --reload
```

👉 Backend:

```
http://127.0.0.1:8000
```

👉 API Docs:

```
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

## 📌 Go to frontend folder

```bash
cd frontend
```

---

## 📌 Install dependencies

```bash id="inst2"
npm install
```

---

## 📌 Run frontend

```bash id="run2"
npm run dev
```

👉 Frontend:

```
http://localhost:5173
```

---

# 🔗 API Connection

Frontend communicates with backend using:

```js id="api"
http://127.0.0.1:8000/predict
```

---

# ⚠️ CORS Fix (if needed)

```python id="cors"
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

# 🧠 System Flow

```
Frontend (React)
      ↓
FastAPI Backend
      ↓
ML Models (Detection + Habitability)
      ↓
Prediction Output
      ↓
Frontend UI Display
```

---

# 🔬 Key Features

* Exoplanet detection using ML
* Habitability classification system
* End-to-end API integration
* Real-time prediction UI

---

# 🤝 Contributors

This project was developed collaboratively:

* **Yusra Azeem**
  🔹 Habitability Prediction Model
  🔹 Feature Engineering & ML Pipeline
  🔹 FastAPI Backend Integration

* **Roshni (@Roshni8954)**
  🔹 Exoplanet Detection Model
  🔹 Dataset preprocessing
  🔹 Model training and evaluation

---

# 🚀 Future Improvements

* Deep learning-based habitability scoring
* Deployment on cloud (Render / Vercel)
* Interactive dashboard for visualization
* Explainable AI for predictions

---

# 👩‍🚀 Author

**Roshni**  https://github.com/Roshni8954
**Yusra Azeem**
GitHub: [https://github.com/Yusra-Azeem](https://github.com/Yusra-Azeem)



