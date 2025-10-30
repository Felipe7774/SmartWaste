# ---- Etapa base ----
FROM python:3.11-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Evitar prompts interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# ---- Dependencias del sistema ----
# Incluye librerías necesarias para TensorFlow, Pillow y SQLite
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# ---- Copiar archivos ----
COPY requirements.txt ./
COPY . .

# ---- Instalar dependencias de Python ----
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# ---- Crear carpeta temporal para imágenes ----
RUN mkdir -p temp model

# ---- Exponer el puerto ----
EXPOSE 5000

# ---- Comando para ejecutar la app ----
CMD ["python", "app.py"]
