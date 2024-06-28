const users = [];

function registerUser(name, email, password) {
    const newUser = { id: users.length + 1, name, email, password }; // Password should be hashed in a real implementation
    users.push(newUser);
    alert('Registration successful');
}

function authenticateUser(email, password) {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Login successful');
        // Redirect to booking page
        document.getElementById('user-management').style.display = 'none';
        document.getElementById('movie-selection').style.display = 'block';
    } else {
        alert('Invalid email or password');
    }
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    registerUser(name, email, password);
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    authenticateUser(email, password);
});

// Sample movie data
const movies = [
    { id: 1, title: "Movie 1", genre: "Action", showtimes: ["12:00 PM", "3:00 PM", "6:00 PM"] },
    { id: 2, title: "Movie 2", genre: "Comedy", showtimes: ["1:00 PM", "4:00 PM", "7:00 PM"] },
    { id: 3, title: "Movie 3", genre: "Drama", showtimes: ["2:00 PM", "5:00 PM", "8:00 PM"] },
];

// Sample seat map with real-time availability (use a backend in real implementation)
// Sample screen data
const screens = [
    { id: 1, name: "Screen 1", capacity: 50 },
    { id: 2, name: "Screen 2", capacity: 60 },
];

let selectedScreen = null;

document.addEventListener('DOMContentLoaded', function() {
    // Display movies (same as before)
    const moviesList = document.getElementById('movies-list');
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `<h4>${movie.title}</h4><p>${movie.genre}</p><p>${movie.showtimes.join(", ")}</p>`;
        movieDiv.addEventListener('click', () => selectMovie(movie));
        moviesList.appendChild(movieDiv);
    });
});

function selectMovie(movie) {
    document.getElementById('movie-selection').style.display = 'none';
    document.getElementById('screen-configuration').style.display = 'block';
    // Display screen selection
    const screenSelectionDiv = document.getElementById('screen-selection');
    screenSelectionDiv.innerHTML = '';
    screens.forEach(screen => {
        const screenDiv = document.createElement('div');
        screenDiv.classList.add('screen');
        screenDiv.innerHTML = `<h4>${screen.name}</h4><p>Capacity: ${screen.capacity}</p>`;
        screenDiv.addEventListener('click', () => selectScreen(screen));
        screenSelectionDiv.appendChild(screenDiv);
    });
}

function selectScreen(screen) {
    selectedScreen = screen;
    document.getElementById('screen-configuration').style.display = 'none';
    document.getElementById('seat-selection').style.display = 'block';
    // Display seat map
    const seatMapDiv = document.getElementById('seat-map');
    seatMapDiv.innerHTML = '';
    for (let i = 0; i < selectedScreen.capacity; i++) {
        const seat = seatMap[i];
        const seatDiv = document.createElement('div');
        seatDiv.classList.add('seat');
        if (seat.booked) seatDiv.classList.add('booked');
        if (seat.locked) seatDiv.classList.add('locked');
        seatDiv.innerText = seat.id;
        seatDiv.addEventListener('click', () => selectSeat(seat));
        seatMapDiv.appendChild(seatDiv);
    }
}

function selectSeat(seat) {
    if (seat.booked || seat.locked) return;

    seat.selected = !seat.selected;
    const seatDiv = document.querySelector(`#seat-map .seat:nth-child(${seat.id})`);
    if (seat.selected) {
        seatDiv.classList.add('selected');
        selectedSeats.push(seat.id);
        lockSeat(seat.id);
    } else {
        seatDiv.classList.remove('selected');
        selectedSeats = selectedSeats.filter(id => id !== seat.id);
        releaseSeat(seat.id);
    }
}

function lockSeat(seatId) {
    const seat = seatMap.find(seat => seat.id === seatId);
    if (seat) {
        seat.locked = true;
        setTimeout(() => releaseSeat(seatId), 60000); // Release after 1 minute if not booked
    }
}

function releaseSeat(seatId) {
    const seat = seatMap.find(seat => seat.id === seatId);
    if (seat) {
        seat.locked = false;
        const seatDiv = document.querySelector(`#seat-map .seat:nth-child(${seat.id})`);
        if (seatDiv) {
            seatDiv.classList.remove('locked');
        }
    }
}

document.getElementById('proceed-to-payment').addEventListener('click', function() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    document.getElementById('seat-selection').style.display = 'none';
    document.getElementById('payment').style.display = 'block';
});

document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Payment processing logic (e.g., integrate with payment gateway)
    selectedSeats.forEach(seatId => {
        const seat = seatMap.find(seat => seat.id === seatId);
        if (seat) seat.booked = true;
    });
    document.getElementById('payment').style.display = 'none';
    document.getElementById('confirmation').style.display = 'block';
    const confirmationDetails = `
        Movie: ${movies.find(movie => movie.id === selectedMovieId).title}<br>
        Seats: ${selectedSeats.join(", ")}<br>
        Total Price: $${selectedSeats.length * 10}
    `;
    document.getElementById('confirmation-details').innerHTML = confirmationDetails;
});


// Sample menu data
const menu = [
    { id: 1, name: "Popcorn", price: 5 },
    { id: 2, name: "Soda", price: 3 },
    { id: 3, name: "Nachos", price: 7 },
];

const cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Display menu
    const menuList = document.getElementById('menu-list');
    menu.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.innerHTML = `<h4>${item.name}</h4><p>$${item.price}</p>`;
        menuItemDiv.addEventListener('click', () => addToCart(item));
        menuList.appendChild(menuItemDiv);
    });
});

function addToCart(item) {
    const cartItem = cart.find(ci => ci.id === item.id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItemsUl = document.getElementById('cart-items');
    cartItemsUl.innerHTML = '';
    cart.forEach(item => {
        const cartItemLi = document.createElement('li');
        cartItemLi.innerHTML = `${item.name} - $${item.price} x ${item.quantity}`;
        cartItemsUl.appendChild(cartItemLi);
    });
    document.getElementById('cart').style.display = cart.length ? 'block' : 'none';
}

document.getElementById('checkout').addEventListener('click', function() {
    document.getElementById('cart').style.display = 'none';
    document.getElementById('food-payment').style.display = 'block';
});

document.getElementById('food-payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Payment processing logic (e.g., integrate with payment gateway)
    document.getElementById('food-payment').style.display = 'none';
    document.getElementById('food-confirmation').style.display = 'block';
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const confirmationDetails = `Your order has been placed. Total: $${total}`;
    document.getElementById('food-confirmation-details').innerText = confirmationDetails;
});
// Admin Panel functionality
let screens = [
    { id: 1, name: "Screen 1", capacity: 50 },
    { id: 2, name: "Screen 2", capacity: 60 },
];
let bookings = [];
let foodItems = [
    { id: 1, name: "Popcorn", price: 5 },
    { id: 2, name: "Soda", price: 3 },
    { id: 3, name: "Nachos", price: 7 },
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel data
    displayScreens();
    displayBookings();
    displayFoodItems();
});

function showAddScreenForm() {
    document.getElementById('add-screen-form').style.display = 'block';
}

function showAddFoodItemForm() {
    document.getElementById('add-food-item-form').style.display = 'block';
}

function displayScreens() {
    const screensList = document.getElementById('screens-list');
    screensList.innerHTML = '';
    screens.forEach(screen => {
        const screenDiv = document.createElement('div');
        screenDiv.innerHTML = `<strong>${screen.name}</strong> (Capacity: ${screen.capacity})`;
        screensList.appendChild(screenDiv);
    });
}

function displayBookings() {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '';
    bookings.forEach(booking => {
        const bookingDiv = document.createElement('div');
        bookingDiv.innerHTML = `
            <strong>Booking ID:</strong> ${booking.id}<br>
            <strong>Movie:</strong> ${booking.movie}<br>
            <strong>Seats:</strong> ${booking.seats.join(", ")}<br>
            <strong>Total Price:</strong> $${booking.totalPrice}
        `;
        bookingsList.appendChild(bookingDiv);
    });
}

function displayFoodItems() {
    const foodItemsList = document.getElementById('food-items-list');
    foodItemsList.innerHTML = '';
    foodItems.forEach(item => {
        const foodItemDiv = document.createElement('div');
        foodItemDiv.innerHTML = `<strong>${item.name}</strong> ($${item.price})`;
        foodItemsList.appendChild(foodItemDiv);
    });
}

document.getElementById('new-screen-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const screenName = document.getElementById('screen-name').value;
    const screenCapacity = document.getElementById('screen-capacity').value;
    const newScreen = { id: screens.length + 1, name: screenName, capacity: parseInt(screenCapacity) };
    screens.push(newScreen);
    displayScreens();
    document.getElementById('add-screen-form').style.display = 'none';
});

document.getElementById('new-food-item-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const foodName = document.getElementById('food-name').value;
    const foodPrice = document.getElementById('food-price').value;
    const newFoodItem = { id: foodItems.length + 1, name: foodName, price: parseFloat(foodPrice) };
    foodItems.push(newFoodItem);
    displayFoodItems();
    document.getElementById('add-food-item-form').style.display = 'none';
});
