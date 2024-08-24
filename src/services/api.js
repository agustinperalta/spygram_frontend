// api.js

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Función para leer el token CSRF desde la cookie
function getCsrfTokenFromCookie() {
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find(cookie => cookie.startsWith('fastapi-csrf-token='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
}

// Función para obtener el token CSRF desde el backend
async function fetchCsrfToken() {
  try {
    const response = await fetch('http://localhost:8000/csrftoken', {
      method: 'GET',
      credentials: 'include', // Asegúrate de incluir las cookies en la solicitud
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    return data.csrf_token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
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

  const url = `http://localhost:8000/discoveryaccount/?${params.toString()}`;
  
  console.log("Generated URL:", url);

  try {
    // Obtener el token CSRF antes de realizar la solicitud
    let csrfToken = getCsrfTokenFromCookie();
    if (!csrfToken) {
      // Si no hay token CSRF en la cookie, realizar una solicitud GET inicial para generarlo
      csrfToken = await fetchCsrfToken();
      if (!csrfToken) {
        throw new Error('CSRF token not found in cookies after initial request');
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken, // Incluir el token CSRF en el encabezado
      },
      credentials: 'include', // Asegúrate de incluir las cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.discovery_response.media;

  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}





  
  