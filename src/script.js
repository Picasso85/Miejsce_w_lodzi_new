// ============================================
// 1. INITIALIZATION & DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Miejsce w Łodzi – strona załadowana');
    initAll();
});

function initAll() {
    initNavigation();
    initSmoothScroll();
    initRouteTabs();
    initTestimonialsSlider();
    initBookingForm();
    initNewsletter();
    initWeatherWidget();
    initMaps();
    initCurrentDate();
    initMobileMenuClose();
    initActiveNav();
    initLightbox();
    addWeatherStyles();
}

// ============================================
// 2. NAVIGATION & MENU
// ============================================
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!nav || !menuToggle || !navMenu) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 100);
    });

    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('click', e => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initMobileMenuClose() {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-menu')?.classList.remove('active');
            document.querySelector('.menu-toggle')?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        const pos = window.scrollY + 120;

        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });
    });
}

// ============================================
// 3. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            const offset = document.querySelector('.main-nav')?.offsetHeight || 0;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });
}

// ============================================
// ROUTE TABS – POPRAWIONE I ODPORNE
// ============================================
function initRouteTabs() {
    const container = document.querySelector('.routes-tabs, .route-tabs, #trasy');
    if (!container) {
        console.warn('Brak kontenera route tabs');
        return;
    }

    const tabs = container.querySelectorAll('[data-route]');
    const contents = document.querySelectorAll('.route-detail');

    if (!tabs.length || !contents.length) {
        console.warn('Brak tabów lub treści tras');
        return;
    }

    // Reset
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    // Aktywuj pierwszy
    tabs[0].classList.add('active');
    const firstId = tabs[0].dataset.route;
    document.getElementById(`${firstId}-route`)?.classList.add('active');

    // Delegacja klików
    container.addEventListener('click', e => {
        const tab = e.target.closest('[data-route]');
        if (!tab) return;

        const routeId = tab.dataset.route;

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${routeId}-route`)?.classList.add('active');
    });

    console.log('Route tabs OK');
}

function updateRouteMap(routeId) {
    // This function can be expanded to show different routes on the map
    console.log(`Wyświetl trasę: ${routeId}`);
    
    // Example coordinates for different routes
    const routeCoordinates = {
        'oswiecim1': [50.034, 19.210],
        'oswiecim2': [50.034, 19.230],
        'krakow': [50.061, 19.936],
        'tyniec': [50.016, 19.800]
    };
    
    if (window.routeMap && routeCoordinates[routeId]) {
        window.routeMap.setView(routeCoordinates[routeId], 12);
    }
}


// ============================================
// 5. TESTIMONIALS
// ============================================
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial');
    if (!slides.length) return;

    let i = 0;
    slides[i].classList.add('active');

    setInterval(() => {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
    }, 5000);
}

// ============================================
// 6. BOOKING FORM
// ============================================
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    // Set minimum date to today
    const dateInput = document.getElementById('cruise-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'To pole jest wymagane');
            } else {
                clearFieldError(field);
            }
        });
        
        // Email validation
        const emailField = document.getElementById('contact-email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                showFieldError(emailField, 'Podaj poprawny adres email');
            }
        }
        
        // Phone validation
        const phoneField = document.getElementById('contact-phone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[+]?[0-9\s\-()]{9,}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                isValid = false;
                showFieldError(phoneField, 'Podaj poprawny numer telefonu');
            }
        }
        
        if (isValid) {
            // Here you would normally send data to server
            // For now, just show success message
            
            // Get form data for display
            const formData = new FormData(this);
            const bookingData = Object.fromEntries(formData);
            
            // Show success modal
            showBookingSuccess(bookingData);
            
            // Reset form
            this.reset();
            
            // Reset date to today
            if (dateInput) {
                dateInput.value = today;
            }
        } else {
            showNotification('Proszę poprawić błędy w formularzu', 'error');
        }
    });
    
    // Real-time validation
    bookingForm.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'To pole jest wymagane');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Podaj poprawny adres email');
            return false;
        }
    }
    
    if (field.id === 'contact-phone' && value) {
        const phoneRegex = /^[+]?[0-9\s\-()]{9,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Podaj poprawny numer telefonu');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 5px;
        font-weight: 600;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showBookingSuccess(bookingData) {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'booking-success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: #17A589;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                font-size: 36px;
            ">
                ✓
            </div>
            <h3 style="color: #1B4F72; margin-bottom: 15px;">Rezerwacja wysłana!</h3>
            <p style="color: #566573; margin-bottom: 20px; line-height: 1.6;">
                Dziękujemy za rezerwację rejsu <strong>${bookingData['cruise-type'] || ''}</strong>.<br>
                Skontaktujemy się z Tobą w ciągu 24 godzin na podany numer telefonu.
            </p>
            <button id="close-success-modal" style="
                background: #17A589;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 30px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            ">
                Zamknij
            </button>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Close modal on button click or background click
    modal.addEventListener('click', function(e) {
        if (e.target.id === 'close-success-modal' || e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Auto-close after 7 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 7000);
}


// ============================================
// 7. LIGHTBOX
// ============================================
function initLightbox() {
    const gallery = document.querySelector('#galeria');
    if (!gallery) return;

    gallery.addEventListener('click', e => {
        const img = e.target.closest('img');
        if (!img) return;

        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        overlay.addEventListener('click', ev => {
            if (ev.target === overlay || ev.target.classList.contains('lightbox-close')) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', esc);
            }
        });
    });
}

// ============================================
// 8. NEWSLETTER
// ============================================
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        showNotification('Zapisano do newslettera!', 'success');
        form.reset();
    });
}

// ============================================
// 9. WEATHER WIDGET - Z API WeatherAPI.com
// ============================================
function initWeatherWidget() {
    const weatherInfo = document.getElementById('weather-info');
    
    if (!weatherInfo) {
        console.error('Weather info element not found');
        return;
    }
    
    // Pokaż ładowanie
    weatherInfo.innerHTML = `
        <div class="weather-loading">
            <div class="weather-spinner"></div>
            <p>Pobieranie pogody...</p>
        </div>
    `;
    
    // Pobierz pogodę
    getWeather();
}

async function getWeather() {
    try {
        const response = await fetch('http://localhost:3000/api/weather');

        if (!response.ok) {
            throw new Error('Błąd backendu');
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error('Brak danych pogodowych');
        }

        updateWeatherUI(data);

    } catch (error) {
        console.error('Błąd pogody:', error);
        showWeatherError();
    }
}


function updateWeatherUI(data) {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;
    
    const temperature = Math.round(data.current.temp_c);
    const conditions = data.current.condition.text;
    const iconUrl = `https:${data.current.condition.icon}`;
    const humidity = data.current.humidity;
    const windSpeed = data.current.wind_kph;
    const feelsLike = Math.round(data.current.feelslike_c);
    
    // Ustal kolor ikony na podstawie pogody
    let iconColor = '#F4D03F'; // domyślnie żółty
    const conditionText = conditions.toLowerCase();
    
    if (conditionText.includes('deszcz') || conditionText.includes('mżawka')) {
        iconColor = '#2E86C1';
    } else if (conditionText.includes('śnieg') || conditionText.includes('śnież')) {
        iconColor = '#AED6F1';
    } else if (conditionText.includes('mgła') || conditionText.includes('mgły')) {
        iconColor = '#BDC3C7';
    } else if (conditionText.includes('burz') || conditionText.includes('burza')) {
        iconColor = '#8E44AD';
    } else if (conditionText.includes('chmur') || conditionText.includes('pochmurn')) {
        iconColor = '#95A5A6';
    }
    
    weatherInfo.innerHTML = `
        <div class="weather-icon">
            <div class="weather-icon-img" style="
                width: 70px;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            ">
                <img src="${iconUrl}" alt="${conditions}" 
                     style="max-width: 100%; max-height: 100%; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));">
            </div>
        </div>
        <div class="weather-data">
            <p class="temperature" style="
                font-size: 2.2rem;
                font-weight: bold;
                margin: 0 0 5px 0;
                color: white;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            ">
                ${temperature}°C
            </p>
            <p class="conditions" style="
                margin: 0 0 8px 0;
                color: rgba(255, 255, 255, 0.95);
                font-size: 1rem;
                font-weight: 500;
            ">
                ${conditions}
            </p>
            <div class="weather-details" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.85);
            ">
                <div>
                    <i class="fas fa-tint" style="margin-right: 5px;"></i>
                    ${humidity}%
                </div>
                <div>
                    <i class="fas fa-wind" style="margin-right: 5px;"></i>
                    ${windSpeed} km/h
                </div>
                <div>
                    <i class="fas fa-temperature-high" style="margin-right: 5px;"></i>
                    Odczuwalna: ${feelsLike}°C
                </div>
                <div>
                    <i class="fas fa-location-dot" style="margin-right: 5px;"></i>
                    ${data.location.name}
                </div>
            </div>
        </div>
    `;
    
    // Dodaj efekt odświeżania co 10 minut nie przestawiaj chyba ze chcesz podac numer karty kredytowej
    setTimeout(() => {
        getWeather();
    }, 10 * 60 * 1000); // 10 minut
}

function showWeatherError() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;
    
    // Fallback na mock dane
    const fallbackData = {
        temperature: '28',
        conditions: 'Fajnie',
        humidity: '65',
        windSpeed: '4',
        feelsLike: '30'
    };
    
    weatherInfo.innerHTML = `
        <div class="weather-icon">
            <i class="fas fa-sun" style="
                font-size: 3rem;
                color: #F4D03F;
                margin-right: 15px;
            "></i>
        </div>
        <div class="weather-data">
            <p class="temperature" style="
                font-size: 2.2rem;
                font-weight: bold;
                margin: 0 0 5px 0;
                color: white;
            ">
                ${fallbackData.temperature}°C
            </p>
            <p class="conditions" style="
                margin: 0 0 8px 0;
                color: rgba(255, 255, 255, 0.9);
                font-size: 1rem;
            ">
                ${fallbackData.conditions}
            </p>
            <div class="weather-error" style="
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.7);
                font-style: italic;
            ">
                Dane z cache | Ostatnia aktualizacja: ${new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}
            </div>
        </div>
    `;
}

// Dodaj style CSS dla weather widget
function addWeatherStyles() {
    // Sprawdź czy style już istnieją
    if (document.querySelector('#weather-custom-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'weather-custom-styles';
    style.textContent = `
        /* Weather Widget Custom Styles */
        .weather-widget {
            position: relative;
            overflow: hidden;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .weather-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%);
            z-index: -2;
        }
        
        .weather-widget::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.1"><path d="M20,30 Q40,20 60,30 T100,30" stroke="white" fill="none"/><path d="M10,50 Q30,40 50,50 T90,50" stroke="white" fill="none"/></svg>');
            animation: waveMove 20s linear infinite;
            z-index: -1;
        }
        
        @keyframes waveMove {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
        }
        
        #weather-info {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            min-height: 140px;
            padding: 10px 0;
        }
        
        .weather-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            color: white;
            text-align: center;
        }
        
        .weather-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #F4D03F;
            animation: weatherSpin 1s linear infinite;
            margin-bottom: 10px;
        }
        
        @keyframes weatherSpin {
            to { transform: rotate(360deg); }
        }
        
        .weather-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .weather-icon-img {
            animation: weatherFloat 3s ease-in-out infinite;
        }
        
        @keyframes weatherFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .weather-data {
            flex: 1;
        }
        
        /* Responsywność */
        @media (max-width: 768px) {
            #weather-info {
                flex-direction: column;
                text-align: center;
            }
            
            .weather-icon {
                margin-right: 0;
                margin-bottom: 15px;
            }
            
            .weather-icon-img {
                margin-right: 0;
            }
            
            .weather-details {
                justify-content: center;
                grid-template-columns: 1fr !important;
                gap: 5px !important;
            }
        }
        
        @media (max-width: 480px) {
            .weather-widget {
                min-height: 160px;
            }
            
            .temperature {
                font-size: 1.8rem !important;
            }
            
            .conditions {
                font-size: 0.9rem !important;
            }
            
            .weather-details {
                font-size: 0.8rem !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 10. MAPS INITIALIZATION
// ============================================
function initMaps() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet nie został załadowany');
        return;
    }
    
    // Contact Map
    const contactMapElement = document.getElementById('map');
    if (contactMapElement) {
        try {
            const contactMap = L.map('map').setView([49.9802, 19.1508], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(contactMap);
            
            // Add marker for "Miejsce w Łodzi"
            const marker = L.marker([49.9802, 19.1508]).addTo(contactMap);
            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>Miejsce w Łodzi</strong><br>
                    Przystań w Brzeszczach<br>
                    ul. T. Kościuszki 24
                </div>
            `).openPopup();
            
            // Store reference
            window.contactMap = contactMap;
        } catch (error) {
            console.error('Błąd inicjalizacji mapy kontaktowej:', error);
        }
    }
    
    // Route Map
    const routeMapElement = document.getElementById('route-map');
    if (routeMapElement) {
        try {
            const routeMap = L.map('route-map').setView([50.034, 19.210], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(routeMap);
            
            // Add route markers
            const routes = [
                { name: 'Przystań', coords: [50.034, 19.210] },
                { name: 'Most Niepodległości', coords: [50.040, 19.220] },
                { name: 'Punkt 0km', coords: [50.028, 19.200] }
            ];
            
            routes.forEach(route => {
                L.marker(route.coords)
                    .addTo(routeMap)
                    .bindPopup(`<strong>${route.name}</strong>`);
            });
            
            // Draw sample route line
            const routeLine = L.polyline(
                routes.map(r => r.coords),
                { color: '#17A589', weight: 3, opacity: 0.7 }
            ).addTo(routeMap);
            
            // Fit bounds to show all markers
            routeMap.fitBounds(routeLine.getBounds());
            
            // Store reference
            window.routeMap = routeMap;
        } catch (error) {
            console.error('Błąd inicjalizacji mapy tras:', error);
        }
    }
}

// ============================================
// 11. UTILITIES
// ============================================
function initCurrentDate() {
    document.querySelectorAll('input[type="date"]').forEach(i => {
        i.min = new Date().toISOString().split('T')[0];
        if (!i.value) i.value = i.min;
    });
}

function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// ============================================
// 12. STYLES (LIGHTBOX + WEATHER)
// ============================================
function addWeatherStyles() {
    if (document.getElementById('dynamic-styles')) return;
    const s = document.createElement('style');
    s.id = 'dynamic-styles';
    s.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.95);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
        }
        .lightbox img {
            max-width:90%;
            max-height:85vh;
            border-radius:8px;
        }
        .lightbox-close {
            position:fixed;
            top:20px;
            right:30px;
            font-size:40px;
            color:#fff;
            cursor:pointer;
        }
    `;
    document.head.appendChild(s);
}

console.log('JS poprawiony i gotowy ✅');
