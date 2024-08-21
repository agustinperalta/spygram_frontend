function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function fetchAccountData(username, startDate, selectedProfileMetrics, selectedContentMetrics) {
  const formattedDate = formatDate(startDate);

  const params = new URLSearchParams({
    user_name: username,
    fecha_desde: formattedDate,
  });

  // Añadir múltiples parámetros para account_metrics y media_metrics
  selectedProfileMetrics.forEach(metric => params.append('account_metrics', metric));
  selectedContentMetrics.forEach(metric => params.append('media_metrics', metric));

  const url = `https://my-fastapi-app-lp5fallhfa-uc.a.run.app/discoveryaccount/?${params.toString()}`;
  
  console.log("Generated URL:", url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.discovery_response.media;

  } catch (error) {
   
    console.error("Fetch error:", error.message); // Aquí se imprime el mensaje de error capturado
    throw error; // Volver a lanzar el error para manejarlo en la función que llama
  }
}

  
  