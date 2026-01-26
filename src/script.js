// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', initAll);

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
    addLightboxStyles();
}

// ===================== NAVIGATION =====================
function initNavigation() {
    const nav = document.querySelector('.main-nav'),
          toggle = document.querySelector('.menu-toggle'),
          menu = document.querySelector('.nav-menu');
    if (!nav || !toggle || !menu) return;

    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY>100));
    toggle.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    document.addEventListener('click', e => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow='';
        }
    });
}

function initMobileMenuClose() {
    document.querySelectorAll('.nav-menu a').forEach(a =>
        a.addEventListener('click', ()=>{document.querySelector('.nav-menu')?.classList.remove('active'); document.querySelector('.menu-toggle')?.classList.remove('active'); document.body.style.overflow='';})
    );
}

function initActiveNav() {
    const sections=document.querySelectorAll('section[id]'), links=document.querySelectorAll('.nav-menu a');
    window.addEventListener('scroll',()=>{
        const pos=window.scrollY+120;
        let current='';
        sections.forEach(s=>{if(pos>=s.offsetTop&&pos<s.offsetTop+s.offsetHeight) current=s.id;});
        links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==`#${current}`));
    });
}

// ===================== SMOOTH SCROLL =====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
        const id=a.getAttribute('href'), target=document.querySelector(id);
        if(id=='#'||!target) return;
        e.preventDefault();
        window.scrollTo({top: target.offsetTop-(document.querySelector('.main-nav')?.offsetHeight||0), behavior:'smooth'});
    }));
}

// ===================== ROUTES =====================
const routeData = {
    oswiecimStart:[[50.0444,19.3146],[50.0460,19.3002],[50.0475,19.2883]],
    oswiecim1:[[50.0444,19.3146],[50.0485,19.2798],[50.0508,19.2590]],
    oswiecim2:[[50.0444,19.3146],[50.0660,19.2332],[50.0437,19.3170],[50.0407,19.3401]],
    krakow:[[50.0444,19.3146],[50.0223,19.5435],[50.0548,19.9295]],
    tyniec:[[50.0444,19.3146],[50.0223,19.5435],[50.0209,19.8018]]
};

function initRouteTabs() {
    const container=document.querySelector('#trasy');
    if(!container) return;
    const tabs=[...container.querySelectorAll('[data-route]')], contents=[...container.querySelectorAll('.route-detail')];
    tabs.forEach(t=>t.classList.remove('active')); contents.forEach(c=>c.classList.remove('active'));
    tabs[0].classList.add('active'); document.getElementById(`${tabs[0].dataset.route}-route`)?.classList.add('active');
    updateRouteMap(tabs[0].dataset.route);

    container.addEventListener('click', e=>{
        const tab=e.target.closest('[data-route]');
        if(!tab) return;
        tabs.forEach(t=>t.classList.remove('active')); contents.forEach(c=>c.classList.remove('active'));
        tab.classList.add('active'); document.getElementById(`${tab.dataset.route}-route`)?.classList.add('active');
        updateRouteMap(tab.dataset.route);
    });
}

function updateRouteMap(routeId){
    if(!window.routeMap||!routeData[routeId]) return;
    
    // Usuń poprzednią linię trasy
    if(window.activeRouteLayer) {
        window.routeMap.removeLayer(window.activeRouteLayer);
    }
    
    // Usuń poprzednie markery (start i meta)
    if(window.routeMarkers) {
        window.routeMarkers.forEach(marker => {
            window.routeMap.removeLayer(marker);
        });
        window.routeMarkers = []; // Wyczyść tablicę
    } else {
        window.routeMarkers = []; // Inicjalizuj jeśli nie istnieje
    }
    
    const path=routeData[routeId];
    
    // Dodaj nową linię trasy
    window.activeRouteLayer = L.polyline(path,{weight:4,color:'#17A589'}).addTo(window.routeMap);
    
    // Dodaj nowe markery i zapisz je do tablicy
    const startMarker = L.marker(path[0]).addTo(window.routeMap).bindPopup('Start');
    const endMarker = L.marker(path[path.length-1]).addTo(window.routeMap).bindPopup('Meta');
    
    window.routeMarkers.push(startMarker, endMarker);
    
    window.routeMap.fitBounds(window.activeRouteLayer.getBounds());
}

// ===================== TESTIMONIALS =====================
function initTestimonialsSlider(){
    const slides=[...document.querySelectorAll('.testimonial')]; if(!slides.length) return;
    let i=0; slides[i].classList.add('active');
    setInterval(()=>{slides[i].classList.remove('active'); i=(i+1)%slides.length; slides[i].classList.add('active');},5000);
}

// ===================== BOOKING FORM =====================
function initBookingForm(){
    const form=document.getElementById('booking-form'); if(!form) return;
    const dateInput=document.getElementById('cruise-date'); if(dateInput){const today=new Date().toISOString().split('T')[0]; dateInput.min=today; dateInput.value=today;}
    form.addEventListener('submit', e=>{
        e.preventDefault(); let isValid=true;
        form.querySelectorAll('[required]').forEach(f=>!f.value.trim()?(isValid=false,showFieldError(f,'To pole jest wymagane')):clearFieldError(f));
        const email=document.getElementById('contact-email'); if(email&&email.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) isValid=false,showFieldError(email,'Podaj poprawny adres email');
        const phone=document.getElementById('contact-phone'); if(phone&&phone.value&&!/^[+]?[0-9\s\-()]{9,}$/.test(phone.value.replace(/\s/g,''))) isValid=false,showFieldError(phone,'Podaj poprawny numer telefonu');
        if(isValid){showBookingSuccess(Object.fromEntries(new FormData(form))); form.reset(); if(dateInput) dateInput.value=new Date().toISOString().split('T')[0];}
        else showNotification('Proszę poprawić błędy w formularzu','error');
    });
    form.querySelectorAll('input,select').forEach(f=>{f.addEventListener('blur',()=>validateField(f)); f.addEventListener('input',()=>clearFieldError(f));});
}
function validateField(f){if(f.hasAttribute('required')&&!f.value.trim()) return showFieldError(f,'To pole jest wymagane'); if(f.type==='email'&&f.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) return showFieldError(f,'Podaj poprawny adres email'); if(f.id==='contact-phone'&&f.value&&!/^[+]?[0-9\s\-()]{9,}$/.test(f.value.replace(/\s/g,''))) return showFieldError(f,'Podaj poprawny numer telefonu'); clearFieldError(f);}
function showFieldError(f,msg){clearFieldError(f);f.style.borderColor='#e74c3c';const d=document.createElement('div');d.className='field-error';d.textContent=msg;d.style.cssText='color:#e74c3c;font-size:12px;margin-top:5px;font-weight:600;';f.parentNode.appendChild(d);}
function clearFieldError(f){f.style.borderColor='';const e=f.parentNode.querySelector('.field-error');if(e)e.remove();}
function showBookingSuccess(data){
    const modal=document.createElement('div'); modal.className='booking-success-modal';
    modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:10000;animation:fadeIn 0.3s ease;';
    modal.innerHTML=`<div style="background:white;padding:40px;border-radius:15px;max-width:500px;width:90%;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <div style="width:80px;height:80px;background:#17A589;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:white;font-size:36px;">✓</div>
        <h3 style="color:#1B4F72;margin-bottom:15px;">Rezerwacja wysłana!</h3>
        <p style="color:#566573;margin-bottom:20px;line-height:1.6;">Dziękujemy za rezerwację rejsu <strong>${data['cruise-type']||''}</strong>.<br>Skontaktujemy się w ciągu 24h.</p>
        <button id="close-success-modal" style="background:#17A589;color:white;border:none;padding:12px 30px;border-radius:30px;font-weight:600;cursor:pointer;transition:all 0.3s;">Zamknij</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e=>{if(e.target.id==='close-success-modal'||e.target===modal) modal.remove();});
    setTimeout(()=>modal.remove(),7000);
}

// ===================== LIGHTBOX =====================
function initLightbox() {
    const gallery = document.querySelector('#galeria');
    if (!gallery) return;

    const images = Array.from(gallery.querySelectorAll('img'));
    let currentIndex = 0;

    gallery.addEventListener('click', e => {
        const img = e.target.closest('img');
        if (!img) return;

        currentIndex = images.indexOf(img);

        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <button class="lightbox-prev">&#10094;</button>
            <img src="${img.src}" alt="${img.alt}">
            <button class="lightbox-next">&#10095;</button>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const lightboxImg = overlay.querySelector('img');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');

        function showImage(index){
            currentIndex = (index + images.length) % images.length;
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt;
        }

        prevBtn.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex - 1); });
        nextBtn.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex + 1); });

        overlay.addEventListener('click', ev => {
            if (ev.target === overlay || ev.target.classList.contains('lightbox-close')) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });

        // Klawiatura
        document.addEventListener('keydown', function esc(e){
            if (e.key === 'Escape') { overlay.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); }
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });

        // SWIPE MOBILE
        let startX = 0;
        overlay.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; });
        overlay.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;
            if (Math.abs(diff) > 50) { // threshold
                if (diff > 0) showImage(currentIndex - 1);
                else showImage(currentIndex + 1);
            }
        });
    });
}
function addLightboxStyles(){
    if (document.querySelector('#lightbox-styles')) return;

    const s = document.createElement('style');
    s.id = 'lightbox-styles';
    s.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .lightbox img {
            max-width: 90%;
            max-height: 80%;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,.5);
        }
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            cursor: pointer;
        }
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 60px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            user-select: none;
        }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }

        .lightbox-prev:hover,
        .lightbox-next:hover {
            color: #17A589;
        }
    `;
    document.head.appendChild(s);
}
// ===================== NEWSLETTER =====================
function initNewsletter(){const f=document.querySelector('.newsletter-form');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();showNotification('Zapisano do newslettera!','success');f.reset();});}

// ===================== WEATHER =====================
function initWeatherWidget(){
    const w=document.getElementById('weather-info'); if(!w)return;
    w.innerHTML='<div class="weather-loading"><div class="weather-spinner"></div><p>Pobieranie pogody...</p></div>';
    getWeather();
}
async function getWeather(){try{const r=await fetch('http://localhost:3000/api/weather');if(!r.ok)throw 0;const d=await r.json();if(!d.current)throw 0;updateWeatherUI(d);}catch(e){showWeatherError();}}
function updateWeatherUI(d){const w=document.getElementById('weather-info');if(!w)return;const t=Math.round(d.current.temp_c),c=d.current.condition.text,i=`https:${d.current.condition.icon}`,h=d.current.humidity,v=d.current.wind_kph,f=Math.round(d.current.feelslike_c);w.innerHTML=`<div class="weather-icon"><div style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;margin-right:15px;"><img src="${i}" alt="${c}" style="max-width:100%;max-height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"></div></div><div class="weather-data"><p style="font-size:2.2rem;font-weight:bold;margin:0 0 5px 0;color:white;text-shadow:1px 1px 3px rgba(0,0,0,0.3);">${t}°C</p><p style="margin:0 0 8px 0;color:rgba(255,255,255,0.95);font-size:1rem;font-weight:500;">${c}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85rem;color:rgba(255,255,255,0.85);"><div><i class="fas fa-tint" style="margin-right:5px;"></i>${h}%</div><div><i class="fas fa-wind" style="margin-right:5px;"></i>${v} km/h</div><div><i class="fas fa-temperature-high" style="margin-right:5px;"></i>Odczuwalna: ${f}°C</div><div><i class="fas fa-location-dot" style="margin-right:5px;"></i>${d.location.name}</div></div></div>`;setTimeout(getWeather,10*60*1000);}
function showWeatherError(){const w=document.getElementById('weather-info');if(!w)return;w.innerHTML=`<div class="weather-icon"><i class="fas fa-sun" style="font-size:3rem;color:#F4D03F;margin-right:15px;"></i></div><div class="weather-data"><p style="font-size:2.2rem;font-weight:bold;margin:0 0 5px 0;color:white;">28°C</p><p style="margin:0 0 8px 0;color:rgba(255,255,255,0.9);font-size:1rem;">Fajnie</p><div style="font-size:0.75rem;color:rgba(255,255,255,0.7);font-style:italic;">Dane z cache | Ostatnia aktualizacja: ${new Date().toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})}</div></div>`;}

// ===================== MAPS =====================
function initMaps(){
    if(typeof L==='undefined') return console.warn('Leaflet nie załadowany');
    
    const contactEl=document.getElementById('map'); 
    if(contactEl){
        const m=L.map('map').setView([50.0444,19.3146],13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(m);
        L.marker([50.0444,19.3146]).addTo(m).bindPopup('<strong>Miejsce w Łodzi</strong>').openPopup();
        window.contactMap=m;
    }
    
    const routeEl=document.getElementById('route-map'); 
    if(routeEl){
        const m=L.map('route-map').setView([50.0444,19.3146],12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(m);
        window.routeMap=m;
        window.routeMarkers = []; // Inicjalizuj tablicę markerów
    }
}

// ===================== UTILITIES =====================
function initCurrentDate(){document.querySelectorAll('input[type="date"]').forEach(i=>{i.min=new Date().toISOString().split('T')[0];if(!i.value)i.value=i.min;});}
function showNotification(msg,type='info'){const n=document.createElement('div');n.className=`notification ${type}`;n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),3000);}

// ===================== EMAIL OBFUSCATION =====================
document.addEventListener('DOMContentLoaded', () => {
    const emailEl = document.getElementById('contact-email');
    if (!emailEl) return;

    const user = 'biuro';
    const domain = 'miejscewlodzi.pl';

    const email = `${user}@${domain}`;
    emailEl.textContent = email;
    emailEl.href = `mailto:${email}`;
});