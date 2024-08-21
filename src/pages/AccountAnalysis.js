import React, { useState } from 'react';
import MediaGrid from '../components/MediaGrid';
import { fetchAccountData } from '../services/api';
import { FaSpinner } from 'react-icons/fa'; // Importar el ícono de carga

const contentMetrics = [
  "comments_count", "like_count", "media_url", "media_product_type",
  "media_type", "owner", "permalink", "timestamp", "username", "caption", "thumbnail_url"
];

const profileMetrics = [
  "id", "followers_count", "biography", "website", "media_count"
];

function AccountAnalysis() {
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedContentMetrics, setSelectedContentMetrics] = useState(contentMetrics);
  const [selectedProfileMetrics, setSelectedProfileMetrics] = useState(profileMetrics);
  const [mediaData, setMediaData] = useState(null);
  const [sortBy, setSortBy] = useState('like_count');
  const [title, setTitle] = useState("What's your @competition posting on Instagram?");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  // Obtener la fecha mínima permitida (hace 1 año desde hoy)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 1);
  const minDateString = minDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Obtener la fecha máxima permitida (la fecha actual)
  const maxDate = new Date();
  const maxDateString = maxDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const isSubmitDisabled = !username || !startDate;
  
  
  const handleSubmit = async () => {
    const lowerCaseUsername = username.toLowerCase(); // Convertir a minúsculas
    setMediaData(null);  // Limpiar datos previos
    setErrorMessage(''); // Limpiar mensajes de error anteriores
    setLoading(true);     // Establecer el estado de carga a true cuando comienza la búsqueda

    try {
      const data = await fetchAccountData(lowerCaseUsername, startDate, selectedProfileMetrics, selectedContentMetrics);
      setMediaData(data);
      setTitle(`What's @${username} posting on Instagram?`);
    } catch (error) {
      if (error.message) {
          setErrorMessage(error.message); // Mostrar el mensaje de error específico devuelto por el backend
      } else {
          setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Establecer el estado de carga a false cuando la búsqueda termina
    }
  };

    // Handle click to open date picker
    const handleDateClick = () => {
      document.getElementById('startDate').showPicker();
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-white">{title}</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl mb-12">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex flex-col flex-1">
            <label htmlFor="username" className="text-lg font-semibold text-gray-800 mb-2">Account Name</label>
            <input 
              id="username"
              type="text" 
              placeholder="Enter the username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>
          <div className="flex flex-col flex-1 relative" onClick={handleDateClick}>
            <label htmlFor="startDate" className="text-lg font-semibold text-gray-800 mb-2">Date Since</label>
            <input 
              id="startDate"
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              min={minDateString} // Establece la fecha mínima permitida
              max={maxDateString} // Establece la fecha máxima permitida
            />
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          className={`mt-4 bg-blue-800 text-white p-3 rounded-lg transition duration-300 shadow-md w-full ${
            isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'
          }`}
          disabled={isSubmitDisabled} // Desactiva el botón si no se han ingresado todos los datos
        >
          Submit
        </button>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <FaSpinner className="animate-spin mr-2 text-blue-800" />
            <span className="text-lg text-blue-800">Searching for content...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {mediaData && mediaData.length === 0 && (
        <div className="mt-8 text-center text-gray-600">
          <p>No content found for the selected period.</p>
        </div>
      )}

      {mediaData && mediaData.length > 0 && (
        <div className="w-full max-w-5xl mb-12">
          <div className="flex justify-end mb-4">
            <div className="flex flex-col w-full max-w-xs">
              <label htmlFor="sortBy" className="text-lg font-semibold text-gray-800 mb-2">Order By</label>
              <select 
                id="sortBy"
                onChange={(e) => setSortBy(e.target.value)} 
                value={sortBy}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="like_count">Most Liked</option>
                <option value="comments_count">Most Commented</option>
                <option value="timestamp">Most Recent</option>
              </select>
            </div>
          </div>
          <MediaGrid mediaData={mediaData} sortBy={sortBy} />
        </div>
      )}
    </div>
  );
}

export default AccountAnalysis;






