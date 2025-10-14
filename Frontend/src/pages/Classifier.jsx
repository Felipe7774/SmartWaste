import { useState, useRef, useEffect, use } from "react";
import { Camera } from "lucide-react";
import "./classifier.css";

function Classifier() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      setIsCameraOn(true);
    } catch (error) {
      alert("No se pudo acceder a la cámara.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (isCameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOn, stream]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);
    stopCamera();
    classifyWaste(imageData);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOn(false);
  };

  const classifyWaste = async (imageData) => {
    try {
      setLoading(true);
      setResult(null);

      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append("file", blob, "captured.png");

      const response = await fetch("http://192.168.1.90:5000/classify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult({
        nombre: data.nombre,
        tipo_residuo: data.tipo_residuo,
        confianza: data.confianza,
      });

      // ✅ Cargar historial después de clasificar
      fetchHistorial();

    } catch (error) {
      console.error("Error al clasificar:", error);
      setResult({ error: "Error al procesar la imagen" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Cargar historial al montar el componente
    fetchHistorial();
  }, []);
  const fetchHistorial = async () => {
    try {
      const res = await fetch("http://192.168.1.90:5000/historial");
      const data = await res.json();
      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  return (
    <div className="classifier-section" id="classifier">
      <div className="classifier-content">
        <div className="text-side">
          <h2>Clasificador Inteligente de Residuos</h2>
          <p>
            Usa tu cámara para capturar el residuo. SmartWaste AI analizará la
            imagen y te dirá cómo debes desecharlo.
          </p>

          {loading && <p>Analizando residuo... 🔍</p>}

          {result && !loading && !result.error && (
            <div className="result-section">
              <h3>Resultado:</h3>
              <p><strong>Objeto:</strong> {result.nombre}</p>
              <p><strong>Tipo de residuo:</strong> {result.tipo_residuo}</p>
              <p><strong>Confianza:</strong> {result.confianza}%</p>
            </div>
          )}

          {result?.error && <p className="error-text">{result.error}</p>}
          {/* tabla que registra el historial de últimos residuos */}
          {historial.length > 0 && (
            <div className="historial-section">
              <h3>Últimos residuos clasificados:</h3>
              <table className="historial-table">
                <thead>
                  <tr>
                    <th>Objeto</th>
                    <th>Tipo</th>
                    <th>Confianza</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>{item.tipo_residuo}</td>
                      <td>{item.confianza}%</td>
                      <td>{item.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="upload-side">
          {!isCameraOn && !image && (
            <button className="open-camera-btn" onClick={openCamera}>
              <Camera size={24} /> Abrir cámara
            </button>
          )}

          {isCameraOn && (
            <div className="camera-container">
              <video ref={videoRef} autoPlay playsInline className="camera-view" />
              <button onClick={captureImage} className="capture-btn">
                Capturar
              </button>
            </div>
          )}

          {image && (
            <div className="preview-section">
              <img src={image} alt="captura" className="preview-image" />
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
        
      </div>
    </div>
  );
}

export default Classifier;