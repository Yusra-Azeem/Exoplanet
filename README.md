
# 🪐 Exoplanet Detection & Habitability Prediction

> **An end-to-end Machine Learning application that detects exoplanets from NASA Kepler observations and predicts their potential habitability using advanced ML pipelines, explainable AI, and a FastAPI + React web application.**

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Vite](https://img.shields.io/badge/Vite-Build-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38BDF8)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange)
![XGBoost](https://img.shields.io/badge/XGBoost-Model-red)
![SHAP](https://img.shields.io/badge/SHAP-Explainability-success)

---

## 🚀 Overview

This project combines **two machine learning pipelines** into a single application:

### 🛰️ Stage 1 – Exoplanet Detection

Predicts whether a **Kepler Object of Interest (KOI)** is a genuine exoplanet or a false positive.

### 🌍 Stage 2 – Habitability Prediction

For confirmed planets, predicts whether they are potentially **habitable** using planetary and stellar characteristics.

---

# ✨ Highlights

* 🛰️ Two-stage prediction pipeline
* 🤖 Compared **13+ Machine Learning models** across both tasks
* 📊 Advanced preprocessing and feature engineering
* ⚖️ Class imbalance handled using **SMOTETomek**
* 🔍 Explainable AI using **SHAP**
* 🚀 FastAPI REST API
* 🎨 React + Tailwind frontend
* ☁️ Deployment-ready architecture

---

# 📸 Demo

<img width="1359" height="572" alt="image" src="https://github.com/user-attachments/assets/f0346ba3-1ef8-497a-a4ed-5b7f4972eeea" />


* Home Page
* Prediction Form
* Detection Result
* Habitability Result
* Swagger API
* SHAP Visualizations

---

# 🏗️ Architecture
<img width="1536" height="1024" alt="Exoplanet" src="https://github.com/user-attachments/assets/1a0852de-264a-4273-810f-2a028b274b1c" />

```text
User Input
      │
      ▼
Detection Model
      │
      ├── False Positive → Stop
      │
      ▼
Confirmed Planet
      │
      ▼
Habitability Pipeline
      │
      ├── Imputation
      ├── Feature Engineering
      ├── Feature Selection
      ├── Scaling
      ▼
Habitability Model
      │
      ▼
Prediction + Explainability
```

---

# 🤖 Machine Learning Pipeline

## 🛰️ Exoplanet Detection

### Dataset

* NASA Kepler Object of Interest (KOI)

### Models Evaluated

* Gaussian Naive Bayes
* Decision Tree
* Logistic Regression
* Perceptron
* Multilayer Perceptron
* Histogram Gradient Boosting

### Techniques

* Missing value handling
* Feature scaling
* Model comparison
* F1-score based model selection

---

## 🌍 Habitability Prediction

### Dataset

* Planetary Habitability Laboratory (PHL) Catalog

### Advanced Preprocessing

* Physics-based Mass–Radius Imputation
* Iterative Imputer
* RobustScaler
* Label Encoding
* Missing Value Handling
* Data Leakage Prevention

### Feature Engineering

* Earth Similarity Index (ESI)
* Habitable Zone Features
* Stellar Flux
* Planet Density Proxy
* Solar-like Star Indicator
* Luminosity Features
* Log Transformations

### Feature Selection

* Variance Inflation Factor (VIF)
* SelectKBest (ANOVA)

### Handling Class Imbalance

* SMOTETomek

### Models Evaluated

* Logistic Regression
* KNN
* Decision Tree
* Random Forest
* XGBoost
* Support Vector Machine
* Multilayer Perceptron

---

# 📊 Evaluation

### Detection

* Accuracy
* Precision
* Recall
* F1 Score
* Average Precision

### Habitability

* Recall
* Precision
* F1 Score
* ROC-AUC
* Average Precision
* Matthews Correlation Coefficient (MCC)

---

# 🔍 Explainable Interface

The project uses **SHAP (SHapley Additive Explanations)** to interpret model predictions and identify the most influential planetary and stellar features affecting habitability.

---

# 🛠️ Tech Stack

| Category         | Technologies              |
| ---------------- | ------------------------- |
| Frontend         | React, Vite, Tailwind CSS |
| Backend          | FastAPI, Uvicorn          |
| Machine Learning | Scikit-learn, XGBoost     |
| Explainability   | SHAP                      |
| Data Processing  | Pandas, NumPy             |
| Visualization    | Matplotlib, Seaborn       |
| Utilities        | Joblib                    |

---

# 📁 Project Structure

```text
Exoplanet/
├── backend/
├── frontend/
├── notebooks/
├── datasets/
├── models/
└── README.md
```

---

# ⚡ Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌟 Future Improvements

* Hyperparameter optimization with Optuna
* Docker containerization
* CI/CD pipeline
* Cloud deployment
* Real-time astronomical data integration
* Automated model monitoring

---

## ⭐ Support

If you found this project interesting, please consider **starring ⭐ the repository**.

* **Installation** is short and clear.
* **Professional formatting** with badges, tables, and sections makes it easy to skim.
