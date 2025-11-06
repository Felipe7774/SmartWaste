♻️ SmartWaste AI

SmartWaste AI es una aplicación web inteligente que utiliza visión artificial y aprendizaje profundo para clasificar residuos capturados desde tu cámara o subidos como imagen.
Su objetivo es fomentar el reciclaje responsable y la educación ambiental, combinando tecnología moderna con impacto ecológico 🌱.

🚀 Características principales

📸 Clasificación de residuos en tiempo real mediante cámara o imagen cargada

🤖 Modelo de IA entrenado con el dataset TrashNet

💾 Historial de clasificaciones guardado automáticamente (SQLite)

🔄 Conexión entre Flask (backend) y React (frontend)

🌍 Compatible con despliegue en Vercel (frontend) y Render / Railway (backend)

🐳 Soporte para Docker

🛠️ Tecnologías utilizadas
🔹 Backend

Python + Flask

TensorFlow / Keras

Flask-SQLAlchemy

Flask-CORS

SQLite

🔹 Frontend

React (Vite / CRA)

JavaScript (ES6+)

CSS3 con diseño responsivo y limpio

Lucide React para íconos

📂 Estructura del proyecto
SmartWaste/
│
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── model/
│   │   └── trash-classification-aug.keras
│   ├── instance/
│   │   └── residuos.db
│   └── Dockerfile
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   └── Classifier.jsx
    │   └── App.jsx
    └── package.json

⚙️ Instalación y ejecución
🧠 Backend (Flask + TensorFlow)

1️⃣ Clona el repositorio:

git clone https://github.com/ThomasJuti/GreenMind-Ai.git
cd GreenMind-Ai/Backend


2️⃣ Crea y activa un entorno virtual:

python -m venv venv
venv\Scripts\activate  # Windows
# o
source venv/bin/activate  # Linux / Mac


3️⃣ Instala dependencias:

pip install -r requirements.txt


4️⃣ Ejecuta el servidor:

python app.py


🔗 Tu backend estará disponible en:

http://127.0.0.1:5000

💻 Frontend (React)

1️⃣ Abre la carpeta del frontend:

cd ../Frontend


2️⃣ Instala dependencias:

npm install


3️⃣ Configura la URL del backend
En Classifier.jsx, cambia la URL del fetch:

const BACKEND_URL = "http://127.0.0.1:5000";


4️⃣ Ejecuta el frontend:

npm start


🌐 La aplicación se abrirá en:

http://localhost:3000

🧠 Dataset utilizado

El modelo de IA fue entrenado con el dataset TrashNet
, que contiene imágenes clasificadas en 6 categorías de residuos:

📦 Cardboard

🍾 Glass

🥫 Metal

📄 Paper

🧴 Plastic

🗑️ Trash

Estructura:

dataset-resized/
├── cardboard/
├── glass/
├── metal/
├── paper/
├── plastic/
└── trash/

🧾 Endpoints del backend
🔹 POST /classify

Clasifica una imagen enviada al modelo.

Ejemplo:

curl -X POST -F "file=@imagen.jpg" http://localhost:5000/classify


Respuesta:

{
  "nombre": "Plástico",
  "tipo_residuo": "Reciclable",
  "confianza": 92.5
}

🔹 GET /historial

Devuelve los últimos residuos clasificados.

Ejemplo:

curl http://localhost:5000/historial


Respuesta:

[
  {
    "nombre": "Vidrio",
    "tipo_residuo": "Reciclable",
    "confianza": 95.1,
    "fecha": "2025-11-05 17:45:12"
  }
]

🐳 Ejecución con Docker

Desde la carpeta Backend:

docker build -t smartwaste-backend .
docker run -p 5000:5000 smartwaste-backend


Backend disponible en:

http://localhost:5000
