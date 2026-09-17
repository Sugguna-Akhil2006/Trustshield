# 🛡️ TrustShield AI

TrustShield AI is an AI-powered phishing email detection system designed to identify malicious emails using a multi-layered detection approach. The system combines machine learning, URL intelligence, rule-based analysis, behavioral analysis, emotional analysis, and explainable AI to provide accurate phishing detection along with clear, human-readable explanations.

## 🚀 Features

- 📧 Phishing email detection
- 🤖 Machine learning-based classification
- 🔗 URL intelligence and suspicious link analysis
- 📋 Rule-based phishing pattern detection
- 😊 Emotional and urgency analysis
- 🧠 Explainable AI for detection reasoning
- 🌐 Chrome Extension integration
- 📊 SOC Dashboard for monitoring
- 🗄️ MongoDB database for storing analysis results
- ⚡ Fast backend using Flask and asynchronous processing

## 🏗️ System Architecture

The project follows a three-tier architecture:

- **Presentation Layer**
  - Chrome Extension
  - Web Dashboard

- **Application Layer**
  - Flask Backend
  - Detection Engine
  - Trust Score Calculation
  - Explanation Generator

- **Data Layer**
  - MongoDB
  - Email Logs
  - Model Metadata
  - Retraining Logs

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Chrome Extension (Manifest V3)

### Backend
- Python
- Flask
- Asyncio

### Database
- MongoDB
- PyMongo

### Machine Learning
- Scikit-learn
- Pandas
- NumPy

### AI
- Ollama (Phi Model)

## ⚙️ Detection Layers

The system combines multiple detection techniques:

- Machine Learning Classification
- URL Intelligence
- Rule-Based Detection
- Emotional Analysis
- Behavioral Analysis
- Attachment Analysis
- Weighted Trust Score Generation

## 📂 Project Structure

```
TrustShield-AI/
│── backend/
│── frontend/
│── chrome-extension/
│── models/
│── static/
│── templates/
│── database/
│── requirements.txt
│── README.md
```

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/<your-username>/TrustShield-AI.git
cd TrustShield-AI
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure MongoDB

Start MongoDB locally and update the database connection string in the backend configuration.

### Run the backend

```bash
python app.py
```

or

```bash
flask run
```

### Load the Chrome Extension

1. Open Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the `chrome-extension` folder.

## 📊 Workflow

1. User opens an email.
2. Chrome Extension extracts email content.
3. Backend receives the request.
4. Multiple detection layers execute in parallel.
5. Scores are aggregated into a trust score.
6. Explainable AI generates the reason for the prediction.
7. Results are stored in MongoDB.
8. Detection result is displayed to the user.

## 📈 Performance

| Scenario | Detection Rate | Latency |
|----------|---------------:|--------:|
| Standard Spam | ~98% | <150 ms |
| Spear Phishing | ~95% | <200 ms |
| Burst Attacks | ≥90% | <220 ms |

## 🔮 Future Enhancements

- Advanced NLP models (BERT/LLMs)
- Real-time threat intelligence integration
- Enhanced attachment scanning
- Continuous model retraining
- Cloud deployment
- Support for additional email platforms

## 👥 Team

- Sai Tejus Y
- Sugguna Akhil

## 🙏 Acknowledgements

We sincerely thank our mentor for their valuable guidance and continuous support throughout the development of this project.

## 📄 License

This project is intended for educational and research purposes.
