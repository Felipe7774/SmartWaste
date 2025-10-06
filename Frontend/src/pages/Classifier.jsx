import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import "./classifier.css";

function Classifier() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
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

  // 🔹 Este efecto se ejecuta cuando isCameraOn cambia a true
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
      // Simulación del backend
      setTimeout(() => {
        setResult("Reciclable");
      }, 1500);
    } catch (error) {
      console.error("Error al clasificar:", error);
    }
  };

  return (
    <div className="classifier-section">
      <div className="classifier-content">
        <div className="text-side">
          <h2>Clasificador Inteligente de Residuos</h2>
          <p>
            Usa tu cámara para capturar el residuo. GreenMind AI analizará la
            imagen y te dirá cómo debes desecharlo.
          </p>

          {result && (
            <div className="result-section">
              <h3>Resultado:</h3>
              <p className={`result ${result.toLowerCase()}`}>{result}</p>
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
