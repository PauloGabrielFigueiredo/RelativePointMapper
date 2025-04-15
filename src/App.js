import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // Estado para a imagem carregada
  const [imageSrc, setImageSrc] = useState(null);
  // Estado para os pontos criados
  const [points, setPoints] = useState([]);
  // Referência para o elemento da imagem
  const imageRef = useRef(null);
  // Estado para controlar a modal
  const [modalOpen, setModalOpen] = useState(false);
  // Guarda as coordenadas temporárias do ponto a criar
  const [tempPoint, setTempPoint] = useState(null);
  // Guarda o nome digitado para o ponto
  const [pointName, setPointName] = useState('');

  // Lida com o upload da imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setPoints([]); // reinicia os pontos ao carregar nova imagem
    };
    reader.readAsDataURL(file);
  };

  // Lida com o clique na imagem para determinar a posição
  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    const percentX = parseFloat(((clickX / width) * 100).toFixed(2));
    const percentY = parseFloat(((clickY / height) * 100).toFixed(2));

    // Guarda as coordenadas temporárias e abre a modal
    setTempPoint({ percentX, percentY });
    setPointName('');
    setModalOpen(true);
  };

  // Guarda o ponto criado com o nome introduzido
  const handleSavePoint = () => {
    if (!pointName.trim()) return; // evita nome vazio
    setPoints([...points, { name: pointName, ...tempPoint }]);
    setModalOpen(false);
  };

  // Permite eliminar um ponto da lista
  const handleDeletePoint = (index) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Editor de Pontos na Imagem</h1>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <label htmlFor="image-upload" className="upload-label">Carregar Imagem</label>
          <input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          {imageSrc && (
            <button className="reset-button" onClick={() => setImageSrc(null)}>
              Remover Imagem
            </button>
          )}
        </div>

        {imageSrc ? (
          <div className="image-container">
            <img 
              src={imageSrc} 
              alt="Carregada" 
              ref={imageRef} 
              onClick={handleImageClick} 
              className="loaded-image"
            />
            {points.map((point, index) => (
              <div 
                key={index}
                className="point-marker"
                style={{
                  left: `calc(${point.percentX}% - 5px)`,
                  top: `calc(${point.percentY}% - 5px)`
                }}
                title={`${point.name}: (${point.percentX}%, ${point.percentY}%)`}
              />
            ))}
          </div>
        ) : (
          <div className="placeholder">
            <p>Por favor, carregue uma imagem para começar.</p>
          </div>
        )}

        {points.length > 0 && (
          <div className="points-list">
            <h2>Pontos Selecionados</h2>
            <ul>
              {points.map((point, index) => (
                <li key={index}>
                  <span>{point.name} - ({point.percentX}%, {point.percentY}%)</span>
                  <button onClick={() => handleDeletePoint(index)} className="delete-button">
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nome do Ponto</h2>
            <p>
              Posição: {tempPoint.percentX}% x, {tempPoint.percentY}% y
            </p>
            <input 
              type="text" 
              placeholder="Insira o nome do ponto" 
              value={pointName}
              onChange={(e) => setPointName(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={() => setModalOpen(false)} className="cancel-button">
                Cancelar
              </button>
              <button onClick={handleSavePoint} className="save-button">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
