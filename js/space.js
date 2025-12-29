const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

async function buscarImagenes() {
  const query = inputBuscar.value.trim();
  
  if (query === '') {
    alert('Por favor ingresa un término de búsqueda');
    return;
  }
  
  contenedor.innerHTML = '<p class="text-center">Buscando...</p>';
  
  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error en la búsqueda');
    }
    
    const data = await response.json();
    const items = data.collection.items;
    
    if (items.length === 0) {
      contenedor.innerHTML = '<p class="text-center">No se encontraron resultados</p>';
      return;
    }
    
    mostrarResultados(items);
    
  } catch (error) {
    console.error('Error:', error);
    contenedor.innerHTML = '<p class="text-center text-danger">Ocurrió un error al buscar las imágenes. Por favor intenta nuevamente.</p>';
  }
}

function mostrarResultados(items) {
  let html = '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">';
  
  items.forEach(item => {
    const { data, links } = item;
    const [info] = data;
    const { title, description, date_created } = info;
    const imageUrl = links && links[0] ? links[0].href : '';
    const fecha = date_created ? new Date(date_created).toLocaleDateString('es-ES') : 'Fecha no disponible';
    
    html += `
      <div class="col">
        <div class="card shadow-sm h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${title}" style="height: 225px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${title}</h5>
            <p class="card-text flex-grow-1">${description ? description.substring(0, 150) + '...' : 'Sin descripción'}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${fecha}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  contenedor.innerHTML = html;
}

btnBuscar.addEventListener('click', buscarImagenes);

inputBuscar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    buscarImagenes();
  }
});