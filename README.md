
# 🌌 Exoplanet Detection & Habitability Prediction

This project uses Machine Learning to detect **exoplanets** and predict their **habitability status** based on astronomical features.

It combines:
- 🧠 Machine Learning models (XGBoost / Logistic Regression)
- 🐍 FastAPI backend for serving predictions
- ⚛️ React frontend for user interaction

---

# 🚀 Project Objective

- Detect whether a celestial object is an **exoplanet**
- Predict whether it is **habitable (Earth-like conditions)**
- Provide real-time predictions via a web interface

---

# 📊 Dataset

We use NASA Kepler Object of Interest (KOI) dataset and habitability-related features.

### Key Features:
- Orbital period
- Planet radius
- Stellar flux
- Distance from star
- Equilibrium temperature
- Signal-to-noise ratio
- Luminosity and derived habitability features

---

# 🧠 Machine Learning Models

## 🔹 Exoplanet Detection Model
- Logistic Regression
- Random Forest
- XGBoost (final model)

## 🔹 Habitability Model
- XGBoost / Logistic Regression
- Feature engineering based on:
  - Earth-like temperature range
  - Flux similarity
  - Radius constraints

---

# ⚙️ Project Pipeline

1. Data Cleaning & Preprocessing  
2. Feature Engineering  
3. Handling Missing Values  
4. Train-Test Split  
5. Model Training (Detection + Habitability)  
6. Evaluation  
7. API Deployment using FastAPI  
8. Frontend integration using React  

---

# 📈 Evaluation Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

Special focus:
- Reducing false positives in habitability detection

---

# 🛠️ Tech Stack

## Backend
- Python 🐍
- FastAPI
- Scikit-learn
- XGBoost
- Pandas / NumPy

## Frontend
- React ⚛️
- JavaScript
- Axios / Fetch API

## Visualization
- Matplotlib
- Seaborn

---

# 📁 Project Structure

```

Exoplanet/
│
├── backend/
│   ├── main.py
│   ├── model.pkl
│   ├── preprocessing.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   └── exploration.ipynb
│
└── README.md

````

---

# 🚀 How to Run the Project

This project has two parts:
- ⚛️ Frontend (React)
- 🐍 Backend (FastAPI)

You need to run both separately.

---

## 📥 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
````

---

# 🐍 Backend Setup (FastAPI)

## 📌 Go to backend folder

```bash
cd backend
```

## 📌 Create virtual environment

```bash
python -m venv venv
```

### Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

---

## 📌 Install dependencies

```bash
pip install -r requirements.txt
```

---

## 📌 Run FastAPI server

```bash
uvicorn main:app --reload
```

👉 Backend runs at:

```
http://127.0.0.1:8000
```

👉 API docs:

```
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup (React)

## 📌 Go to frontend folder

```bash
cd frontend
```

## 📌 Install dependencies

```bash
npm install
```

## 📌 Start React app

```bash
npm run dev
```

👉 Frontend runs at:

```
http://localhost:5173
```

---

# 🔗 Connecting Frontend & Backend

Make sure React calls FastAPI backend:

```js
http://127.0.0.1:8000/predict
```

Example:

```js
fetch("http://127.0.0.1:8000/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
```

---

# ⚠️ CORS Fix (Important)

If frontend cannot connect to backend, add this in FastAPI:

```python
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
React UI → FastAPI Backend → ML Model → Prediction → UI Display
```

---

# 🔬 Key Challenges

* Handling missing astrophysical data
* Imbalanced classification
* Combining multiple datasets (KOI + habitability features)
* Ensuring stable predictions across models

---

# 🚀 Future Improvements

* Deep Learning model for habitability scoring
* Real-time NASA API integration
* Explainable AI (why a planet is habitable)
* Interactive dashboard for visualization
* Deployment on cloud (Render / Vercel)

---

# 👩‍🚀 Author

**Yusra Azeem**
GitHub: [Yusra-Azeem](https://github.com/Yusra-Azeem)
**Roshni**
Github: (https://github.com/Roshni8954)
---

# ⭐ Acknowledgements

* NASA Exoplanet Archive
* Planetary Habitability Laboratory (PHL)
* Scikit-learn & XGBoost community

```

---

If you want next upgrades, I can help you make it **top 1% GitHub project** with:
- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}
- :contentReference[oaicite:3]{index=3}

Just tell 👍
```
