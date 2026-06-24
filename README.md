# 🌌 End-to-End Exoplanet Detection & Habitability Prediction System

An end-to-end Machine Learning project that combines **exoplanet detection** and **habitability prediction** into a single system with a **FastAPI backend** and **React frontend**.

The project analyzes astronomical and planetary features to:

* 🪐 detect whether a celestial object is an **exoplanet**
* 🌍 predict whether the detected exoplanet is **potentially habitable**

---

# 🚀 Project Objective

This project was built to explore how Machine Learning can support two related astronomy tasks in a single workflow:

* **Exoplanet Detection** — classify whether a celestial object is an exoplanet
* **Habitability Prediction** — estimate whether an exoplanet may support Earth-like life
* **End-to-End Deployment** — expose trained models through an API and interactive frontend

---

# 🌍 Why This Project Matters

Discovering exoplanets is an important step in understanding planetary systems beyond our own. However, detection alone is not enough — a more meaningful scientific question is whether a detected planet could support conditions suitable for life.

This project attempts to bridge both tasks by building a system that not only identifies exoplanets but also evaluates their potential habitability using ML models trained on planetary and Earth-similarity related features.

---

# 🧠 Project Modules

## 🔹 1) Exoplanet Detection

This module predicts whether a celestial object is an exoplanet using astronomical features.

### Workflow

* Data preprocessing and cleaning
* Feature engineering
* Classification model training
* Model evaluation and comparison

### Candidate models

* Logistic Regression
* Random Forest
* XGBoost

---

## 🔹 2) Habitability Prediction

This module predicts whether an exoplanet is potentially habitable based on planetary characteristics such as temperature, Earth similarity, and environmental features.

### Workflow

* Missing value handling and preprocessing
* Feature engineering using habitability-related planetary features
* Handling severe class imbalance
* Model training and evaluation
* SHAP-based interpretability analysis

### Candidate models

* Logistic Regression
* XGBoost

---

# 👩‍💻 My Contribution (Yusra Azeem)

I primarily worked on the **Habitability Prediction** pipeline and backend integration for this project.

## My contributions included:

* Building the **habitability prediction pipeline**
* Performing **feature engineering** using planetary habitability-related attributes
* Handling **missing values and preprocessing**
* Addressing **severe class imbalance** using resampling techniques such as **SMOTE** and **SMOTETomek**
* Training and comparing **Logistic Regression** and **XGBoost**
* Evaluating models using **Recall, F1-score, ROC-AUC, and Precision-Recall AUC**
* Using **SHAP** to interpret model predictions and identify key habitability features
* Integrating the trained model into the **FastAPI backend**

---

# 📊 Habitability Model Insights

The habitability dataset was **highly imbalanced**, with habitable planets forming only a small minority of the samples. Because of this, the project focused not just on overall accuracy, but on building a model that could better identify rare habitable planets.

## Key findings

### 1) Recall was prioritized over accuracy

In an imbalanced dataset, accuracy can be misleading because a model may predict the majority class most of the time and still achieve a high score.

For this reason, **Recall** was treated as the primary metric for the habitability task, since the goal was to correctly identify as many truly habitable planets as possible.

---

### 2) SMOTETomek performed better than plain SMOTE

To improve minority-class learning, oversampling techniques were applied to the training data.

* **SMOTE** generates synthetic minority samples
* **SMOTETomek** combines SMOTE with Tomek Links to remove overlapping or ambiguous boundary samples

SMOTETomek produced a **cleaner class boundary** and gave better minority-class detection performance than plain SMOTE.

---

### 3) SHAP identified the most important habitability features

SHAP analysis showed that the most influential features for habitability prediction were:

* **`P_TEMP_EQUIL`** — equilibrium temperature
* **`P_ESI`** — Earth Similarity Index

These are scientifically meaningful features because they directly relate to temperature suitability and Earth-like planetary conditions.

---

### 4) Precision-Recall AUC was more informative than ROC-AUC

Because habitable planets are rare, **PR-AUC** was more useful than ROC-AUC for evaluating real model performance on the positive class.

PR-AUC gives a clearer picture of:

* how many predicted habitable planets are actually correct (**precision**)
* how many truly habitable planets were found (**recall**)

---

# 🛠️ Tech Stack

## Machine Learning / Data Science

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Imbalanced-learn
* SHAP

## Backend

* FastAPI
* Uvicorn

## Frontend

* React
* JavaScript / TypeScript
* Tailwind CSS

---

# 🧩 System Architecture

```text
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

# 📁 Project Structure

```text
project/
│
├── backend/
│   ├── main.py
│   ├── model_artifacts/
│   ├── preprocessing/
│   └── ML pipeline code
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
└── README.md
```

---

# 🚀 Running the Project Locally

## 1) Backend Setup

```bash
cd backend
pip install fastapi uvicorn pandas numpy scikit-learn xgboost imbalanced-learn shap
uvicorn main:app --reload
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

API docs:

```bash
http://127.0.0.1:8000/docs
```

---

## 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 🔗 API Endpoint

The frontend communicates with the backend prediction API:

```http
POST /predict
```

---

# 🔬 Key Features

* Exoplanet detection using supervised ML models
* Habitability prediction using planetary and Earth-similarity features
* Handling of missing values and severe class imbalance
* Model explainability using SHAP
* FastAPI backend for inference
* React frontend for user interaction

---

# 🚀 Future Improvements

* Add model confidence scores and richer explanation output
* Build a dedicated visualization dashboard for planetary features
* Experiment with deep learning or ensemble stacking methods
* Improve deployment pipeline for production hosting
* Extend habitability scoring beyond binary classification

---

# 🤝 Contributors

## **Yusra Azeem**

* Habitability prediction model
* Feature engineering and evaluation
* SHAP analysis
* FastAPI backend integration

## **Roshni**

* Exoplanet detection model
* Dataset preprocessing
* Model training and evaluation

---

# 👩‍🚀 Author Links

* **Yusra Azeem** — GitHub: https://github.com/Yusra-Azeem
* **Roshni** — GitHub: https://github.com/Roshni8954
