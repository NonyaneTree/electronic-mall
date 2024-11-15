// Function to show the selected page and hide others 
function showPage(page) {
  const pages = ['mall-page', 'refill-page', 'refreshments-page', 'rest-page', 'safety-page'];
  pages.forEach(p => {
    document.getElementById(p).style.display = p === `${page}-page` ? 'block' : 'none';
  });

  // Initialize maps for specific pages
  if (page === 'refill') {
    initMap('refill-map', 'gas_station');
  } else if (page === 'refreshments') {
    initMap('refreshments-map', 'restaurant');
  } else if (page === 'rest') {
    initMap('rest-map', 'lodging');
  } else if (page === 'safety') {
    initMap('safety-map', 'hospital');
  }
}

// Initialize map based on type and target element ID
function initMap(elementId, placeType) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };

      const map = new google.maps.Map(document.getElementById(elementId), {
        center: userLocation,
        zoom: 13
      });

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: userLocation,
          radius: 5000,
          type: [placeType]
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
              });

              // Click event to show place details
              google.maps.event.addListener(marker, 'click', () => {
                const infoWindow = new google.maps.InfoWindow({
                  content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`
                });
                infoWindow.open(map, marker);
              });
            });
          }
        }
      );
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Cart functionality (for the Mall page)
let cartItems = [];
function addToCart(item, price) {
  cartItems.push({ item, price });
  updateCart();
}

function updateCart() {
  const cartItemsList = document.getElementById('cart-items');
  cartItemsList.innerHTML = '';
  let total = 0;
  cartItems.forEach(cartItem => {
    const listItem = document.createElement('li');
    listItem.textContent = `${cartItem.item}: R${cartItem.price.toFixed(2)}`;
    cartItemsList.appendChild(listItem);
    total += cartItem.price;
  });
  document.getElementById('total-amount').textContent = total.toFixed(2);
}

function checkout() {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Proceeding to checkout...");
    // Reset cart
    cartItems = [];
    updateCart();
  }
}

// Function to toggle the dropdown menu
function toggleDropdown() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.classList.toggle('show'); // Toggle the visibility of the dropdown
}

// Event listener for the hamburger menu icon
document.getElementById('option-icon').addEventListener('click', toggleDropdown);

// Optional: Close the dropdown if the user clicks anywhere outside of it
document.addEventListener('click', function(event) {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const optionIcon = document.getElementById('option-icon');
  // If the click is outside the option icon or dropdown, close the dropdown
  if (!optionIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
});


