from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

#Configuración de base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///residuos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Modelo de datos
class Residuo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    tipo_residuo = db.Column(db.String(50))
    confianza = db.Column(db.Float)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

# Ruta del modelo
model_path = os.path.join("model", "trash-classification-aug.keras")
model = tf.keras.models.load_model(model_path)

# Clases del modelo
classes = ['Carton', 'Metal', 'Papel', 'Plastico', 'Vidrio']

# Mapeo de clases a español y tipo de residuo
CLASS_MAPPING = {
    "Carton": ("Cartón", "Reciclable"),
    "Metal": ("Metal", "Reciclable"),
    "Papel": ("Papel", "Reciclable"),
    "Plastico": ("Plástico", "Reciclable"),
    "Vidrio": ("Vidrio", "Reciclable"),
}

# Función de preprocesamiento
def preprocess_image(img_path, target_size=(32, 32)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

# Ruta para clasificar imágenes
@app.route('/classify', methods=['POST'])
def classify():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se envió ninguna imagen'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nombre de archivo vacío'}), 400

        # Guardar imagen temporalmente
        temp_dir = 'temp'
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)

        # Procesar imagen y predecir
        img_array = preprocess_image(file_path)
        preds = model.predict(img_array)
        class_idx = np.argmax(preds[0])
        class_name = classes[class_idx]
        confidence = float(preds[0][class_idx]) * 100

        # Eliminar imagen temporal
        os.remove(file_path)

        # Obtener nombre en español y tipo de residuo
        nombre_es, tipo_residuo = CLASS_MAPPING.get(class_name, ("Desconocido", "No clasificable"))

        # Guardar en la base de datos
        nuevo_residuo = Residuo(
            nombre=nombre_es,
            tipo_residuo=tipo_residuo,
            confianza=round(confidence, 2)
        )
        db.session.add(nuevo_residuo)
        db.session.commit()

        return jsonify({
            "nombre": nombre_es,
            "tipo_residuo": tipo_residuo,
            "confianza": round(confidence, 2)
        })

    except Exception as e:
        print(f"Error en /classify: {e}")
        return jsonify({'error': str(e)}), 500

# Ruta para obtener historial de residuos
@app.route('/historial', methods=['GET'])
def historial():
    residuos = Residuo.query.order_by(Residuo.fecha.desc()).limit(10).all()
    return jsonify([
        {
            "nombre": r.nombre,
            "tipo_residuo": r.tipo_residuo,
            "confianza": r.confianza,
            "fecha": r.fecha.strftime("%Y-%m-%d %H:%M:%S")
        } for r in residuos
    ])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)