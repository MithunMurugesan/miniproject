const form = document.getElementById('vehicleForm');
const vehicleList = document.getElementById('vehicleList');

let editingId = null;

// Submit form: create or update vehicle
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;

  if (editingId) {
    await fetch(`/vehicles/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    });
    editingId = null;
  } else {
    await fetch('/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    });
  }

  form.reset();
  loadVehicles();
});

// Load all vehicles from backend and display
async function loadVehicles() {
  const res = await fetch('/vehicles');
  const vehicles = await res.json();
  vehicleList.innerHTML = '';
  vehicles.forEach(vehicle => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${vehicle.name}</strong> - ${vehicle.type}
      <span>
        <button onclick="editVehicle('${vehicle._id}', '${vehicle.name}', '${vehicle.type}')">Edit</button>
        <button onclick="deleteVehicle('${vehicle._id}')">Delete</button>
      </span>
    `;
    vehicleList.appendChild(li);
  });
}

// Delete a vehicle by id
async function deleteVehicle(id) {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    await fetch(`/vehicles/${id}`, { method: 'DELETE' });
    loadVehicles();
  }
}

// Load vehicle data into form to edit
function editVehicle(id, name, type) {
  document.getElementById('name').value = name;
  document.getElementById('type').value = type;
  editingId = id;
}

// Initial load
loadVehicles();
