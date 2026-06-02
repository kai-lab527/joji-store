const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .song-card, .merch-card, .fthumb, .opt-btn, .progress-bar').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

// Scroll functions
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToMusic() { document.getElementById('music-sec').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function scrollToMerch() { document.getElementById('merch-sec').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function scrollToFeatured() { document.getElementById('featured-sec').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

// ========== CART FUNCTIONS ==========
let cart = [];
let cartOpen = false;

function openCart() {
    cartOpen = true;
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.add('on');
    if (overlay) overlay.classList.add('on');
}

function closeCart() {
    cartOpen = false;
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.remove('on');
    if (overlay) overlay.classList.remove('on');
}

function addCart(name, price, variant, imgPath) {
    console.log('Adding to cart:', name, price, variant, imgPath);
    cart.push({
        name: name,
        price: parseFloat(price),
        variant: variant,
        img: imgPath || 'images/star.png',
        id: Date.now()
    });
    renderCart();
    openCart();
    toast('Added — ' + name);
}

function removeCart(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

function renderCart() {
    const body = document.getElementById('cartBody');
    const empty = document.getElementById('cartEmpty');
    const foot = document.getElementById('cartFoot');
    const cartBadge = document.getElementById('cartBadge');
    const navBadge = document.getElementById('cartBadgeNav');

    if (!body) return;

    body.innerHTML = '';

    if (cart.length === 0) {
        if (empty) body.appendChild(empty);
        if (foot) foot.style.display = 'none';
        if (cartBadge) cartBadge.classList.remove('on');
        if (navBadge) navBadge.classList.remove('on');
        return;
    }

    if (cartBadge) {
        cartBadge.textContent = cart.length;
        cartBadge.classList.add('on');
    }
    if (navBadge) {
        navBadge.textContent = cart.length;
        navBadge.classList.add('on');
    }

    if (foot) foot.style.display = 'block';

    cart.forEach(c => {
        const d = document.createElement('div');
        d.className = 'citem';
        d.innerHTML = `<div class="citem-img"><img src="${c.img}" onerror="this.style.display='none'" style="width:58px;height:58px;object-fit:cover"></div>
                       <div class="citem-det">
                           <div class="citem-name">${c.name}</div>
                           <div class="citem-var">${c.variant}</div>
                           <div class="citem-price">$${c.price.toFixed(2)}</div>
                       </div>
                       <button class="citem-rm" onclick="removeCart(${c.id})">✕</button>`;
        body.appendChild(d);
    });

    const total = cart.reduce((s, c) => s + c.price, 0);
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        toast('Your bag is empty!');
        return;
    }
    cart = [];
    renderCart();
    closeCart();
    toast('Thank you for your purchase! 🎵');
}

function flashBtn(btn) {
    const originalText = btn.textContent;
    btn.classList.add('done');
    btn.textContent = '✓ Added';
    setTimeout(() => {
        btn.classList.remove('done');
        btn.textContent = originalText;
    }, 1800);
}

function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('on'), 2600);
}

// ========== FEATURED SECTION ==========
let currentAlbum = 'PISS IN THE WIND';
let currentFormat = 'cd';
let currentEdition = 'standard';

const pricing = {
    'PISS IN THE WIND': { base: 13.99, cd: 1, vinyl: 1.5, cassette: 0.9, standard: 1, deluxe: 1.3, signed: 2 },
    'SMITHEREENS': { base: 29.99, cd: 0.7, vinyl: 1, cassette: 0.6, standard: 1, deluxe: 1.25, signed: 1.8 },
    'NECTAR': { base: 13.99, cd: 1, vinyl: 1.5, cassette: 0.9, standard: 1, deluxe: 1.3, signed: 2 },
    'BALLADS 1': { base: 27.99, cd: 0.7, vinyl: 1, cassette: 0.6, standard: 1, deluxe: 1.25, signed: 1.8 },
    'IN TONGUES': { base: 14.99, cd: 0.8, vinyl: 1.2, cassette: 1, standard: 1, deluxe: 1.3, signed: 1.9 }
};

const albumImages = {
    'PISS IN THE WIND': 'images/PISS IN THE WIND.jpg',
    'SMITHEREENS': 'images/SMITHEREENS.jpg',
    'NECTAR': 'images/NECTAR.jpg',
    'BALLADS 1': 'images/BALLADS 1.jpg',
    'IN TONGUES': 'images/IN TOUNGES.jpg'
};

function calculatePrice() {
    const albumData = pricing[currentAlbum];
    if (!albumData) return 13.99;
    let price = albumData.base;
    price *= albumData[currentFormat];
    price *= albumData[currentEdition];
    return Math.round(price * 100) / 100;
}

function updatePriceDisplay() {
    const newPrice = calculatePrice();
    const priceEl = document.getElementById('featPrice');
    if (priceEl) priceEl.textContent = '$' + newPrice.toFixed(2);
}

function selectFormat(btn, format) {
    document.querySelectorAll('#formatRow .opt-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    currentFormat = format;
    updatePriceDisplay();
}

function selectEdition(btn, edition) {
    document.querySelectorAll('#editionRow .opt-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    currentEdition = edition;
    updatePriceDisplay();
}

function addFeaturedToCart() {
    const price = calculatePrice();
    let variant = '';

    if (currentFormat === 'cd') variant = 'CD';
    else if (currentFormat === 'vinyl') variant = 'Vinyl';
    else variant = 'Cassette';

    if (currentEdition === 'standard') variant += ' / Standard';
    else if (currentEdition === 'deluxe') variant += ' / Deluxe';
    else variant += ' / Signed';

    const displayName = currentAlbum === 'PISS IN THE WIND' ? 'Piss In The Wind' : currentAlbum;
    const imgPath = albumImages[currentAlbum] || 'images/star.png';
    addCart(displayName, price, variant, imgPath);
    flashBtn(document.getElementById('featAtc'));
}

function switchFeat(el, src, title) {
    document.querySelectorAll('.fthumb').forEach(t => t.classList.remove('act'));
    el.classList.add('act');
    const m = document.getElementById('featMain');
    if (m) {
        m.style.opacity = '0';
        setTimeout(() => {
            m.src = src;
            m.style.opacity = '1';
        }, 220);
    }

    const featTitle = document.querySelector('.feat-title');
    if (featTitle) {
        if (title === 'SMITHEREENS') {
            featTitle.innerHTML = 'SMITHEREENS<span>BLACK VINYL</span>';
        } else if (title === 'NECTAR') {
            featTitle.innerHTML = 'NECTAR<span>STANDARD CD</span>';
        } else if (title === 'BALLADS 1') {
            featTitle.innerHTML = 'BALLADS 1<span>RED EDITION</span>';
        } else if (title === 'IN TONGUES') {
            featTitle.innerHTML = 'IN TONGUES<span>DELUXE CASSETTE</span>';
        } else {
            featTitle.innerHTML = 'PISS IN<span>THE WIND</span>';
        }
    }

    currentAlbum = title;
    updatePriceDisplay();
}

function selOpt(btn) {
    btn.closest('.opt-row').querySelectorAll('.opt-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
}

// ========== AUDIO PLAYER ==========
const songs = [
    { id: 0, name: 'Glimpse of Us', album: 'SMITHEREENS · 2022', dur: '3:53', durS: 233, thumb: 'images/GLIMPSE OF US.png' },
    { id: 1, name: 'Sanctuary', album: 'NECTAR · 2019', dur: '3:00', durS: 180, thumb: 'images/SANCTUARY.jpg' },
    { id: 2, name: 'Slow Dancing in the Dark', album: 'BALLADS 1 · 2018', dur: '3:29', durS: 209, thumb: 'images/SLOW DANCING IN THE DARK.jpg' },
    { id: 3, name: 'Gimme Love', album: 'NECTAR · 2020', dur: '3:54', durS: 234, thumb: 'images/GIMME LOVE.jpg' },
    { id: 4, name: 'Die For You', album: 'SMITHEREENS · 2022', dur: '3:31', durS: 211, thumb: 'images/DIE FOR YOU.png' },
    { id: 5, name: 'YEAH RIGHT', album: 'BALLADS 1 · 2018', dur: '3:14', durS: 194, thumb: 'images/YEAH RIGHT.png' }
];

const audioFiles = [
    'audio/Joji - Glimpse of Us (Lyrics).mp3',
    'audio/Joji - Sanctuary (Lyrics).mp3',
    'audio/Joji - SLOW DANCING IN THE DARK (Lyrics).mp3',
    'audio/Joji - Gimme Love (Lyrics).mp3',
    'audio/Joji - Die For You (Lyrics).mp3',
    'audio/Joji - Yeah Right (Lyrics).mp3'
];

songs.forEach((s, i) => s.file = audioFiles[i]);

let curSong = -1, isPlaying = false;
const audio = document.createElement('audio');
audio.id = 'audio';
audio.preload = 'metadata';
audio.style.display = 'none';
document.body.appendChild(audio);

audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration)) {
        const durEl = document.getElementById('progDur');
        if (durEl) durEl.textContent = fmtTime(Math.floor(audio.duration));
    }
});

audio.addEventListener('timeupdate', () => {
    const pct = (audio.duration > 0) ? (audio.currentTime / audio.duration * 100) : 0;
    const fillEl = document.getElementById('progFill');
    const curEl = document.getElementById('progCur');
    if (fillEl) fillEl.style.width = pct + '%';
    if (curEl) curEl.textContent = fmtTime(Math.floor(audio.currentTime));
});

audio.addEventListener('playing', () => updateStatus('Playing'));
audio.addEventListener('pause', () => { if (audio.currentTime > 0 && !audio.ended) updateStatus('Paused'); });
audio.addEventListener('waiting', () => updateStatus('Buffering...'));
audio.addEventListener('error', () => { updateStatus('Playback error'); toast('Error playing file - check file path'); });
audio.addEventListener('ended', () => nextSong());

function playSong(idx) {
    if (curSong === idx && isPlaying) {
        pauseSong();
        return;
    }

    document.querySelectorAll('.song-card').forEach((c, i) => {
        c.classList.remove('playing');
        const spo = document.getElementById('spo' + i);
        if (spo) spo.textContent = '▶';
    });

    curSong = idx;
    const s = songs[idx];
    const playerSong = document.getElementById('playerSong');
    const pcPlay = document.getElementById('pcPlay');
    const fillEl = document.getElementById('progFill');
    
    if (playerSong) playerSong.textContent = s.name;
    if (pcPlay) pcPlay.innerHTML = '⏸';
    if (fillEl) fillEl.style.width = '0%';
    
    updateStatus('Loading...');

    const art = document.getElementById('playerArt');
    const def = document.getElementById('playerArtDef');
    if (art) {
        art.src = s.thumb;
        art.style.display = 'block';
        if (def) def.style.display = 'none';
        art.onerror = () => {
            art.style.display = 'none';
            if (def) def.style.display = 'flex';
        };
    }

    const card = document.getElementById('sc' + idx);
    if (card) {
        card.classList.add('playing');
        const spo = document.getElementById('spo' + idx);
        if (spo) spo.textContent = '⏸';
    }

    audio.src = s.file;
    audio.currentTime = 0;
    const volSlider = document.getElementById('volSlider');
    audio.volume = Number(volSlider ? volSlider.value : 0.8) || 0.8;

    audio.play().then(() => {
        isPlaying = true;
        toast('Now playing: ' + s.name);
    }).catch(() => {
        isPlaying = false;
        updateStatus('Click play button');
        toast('Click the play button to start');
    });
}

function pauseSong() {
    if (audio && !audio.paused) audio.pause();
    isPlaying = false;
    const pcPlay = document.getElementById('pcPlay');
    if (pcPlay) pcPlay.innerHTML = '▶';
    updateStatus('Paused');
    const card = document.getElementById('sc' + curSong);
    if (card) {
        card.classList.remove('playing');
        const spo = document.getElementById('spo' + curSong);
        if (spo) spo.textContent = '▶';
    }
}

function togglePlay() {
    if (curSong === -1) {
        playSong(0);
        return;
    }
    if (isPlaying) {
        pauseSong();
    } else {
        audio.play().then(() => {
            isPlaying = true;
            const pcPlay = document.getElementById('pcPlay');
            if (pcPlay) pcPlay.innerHTML = '⏸';
            updateStatus('Playing');
            const card = document.getElementById('sc' + curSong);
            if (card) {
                card.classList.add('playing');
                const spo = document.getElementById('spo' + curSong);
                if (spo) spo.textContent = '⏸';
            }
        }).catch(() => {
            updateStatus('Click to play');
            toast('Click the play button');
        });
    }
}

function nextSong() { playSong((curSong + 1) % songs.length); }
function prevSong() { playSong((curSong - 1 + songs.length) % songs.length); }

function seekSong(e) {
    if (!audio || !audio.duration) return;
    const bar = document.getElementById('progBar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
}

function setVol(v) {
    const volNum = Number(v);
    if (audio) audio.volume = volNum;
    const volIcon = document.querySelector('.vol-icon');
    if (volIcon) volIcon.textContent = volNum < 0.01 ? '🔇' : volNum < 0.5 ? '🔉' : '🔊';
}

function updateStatus(message) {
    const el = document.getElementById('playerStatus');
    if (el) el.textContent = message;
}

function fmtTime(s) {
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
}

// ========== EXTERNAL LINKS ==========
function openLink(url) {
    window.open(url, '_blank');
}

// ========== INTERSECTION OBSERVER ==========
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('vis');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.merch-card').forEach(c => obs.observe(c));

// ========== CD HOVER EFFECT ==========
const heroRight = document.querySelector('.hero-right');
if (heroRight) {
    heroRight.addEventListener('mousemove', e => {
        const r = heroRight.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width * 14;
        const y = (e.clientY - r.top - r.height / 2) / r.height * 14;
        const cd = document.getElementById('heroCD');
        if (cd) cd.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    heroRight.addEventListener('mouseleave', () => {
        const cd = document.getElementById('heroCD');
        if (cd) cd.style.transform = '';
    });

    heroRight.addEventListener('mouseenter', () => {
        const cdSpin = document.querySelector('.cd');
        if (cdSpin) cdSpin.style.animationPlayState = 'paused';
    });

    heroRight.addEventListener('mouseleave', () => {
        const cdSpin = document.querySelector('.cd');
        if (cdSpin) cdSpin.style.animationPlayState = 'running';
    });
}

// ========== ESCAPE KEY ==========
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('ytOverlay');
        if (overlay) overlay.classList.remove('open');
    }
});