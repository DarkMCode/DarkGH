const t1 = document.getElementById("a1");
const t2 = document.getElementById("a2");
const t3 = document.getElementById("a3");
const t4 = document.getElementById("a4");
const t5 = document.getElementById("a5");
const t6 = document.getElementById("a6");
const t7 = document.getElementById("a7");
const t8 = document.getElementById("a8");

const playStopBtn = document.getElementById("playStopBtn");
const amb_down = document.getElementById("amb_down");
const amb_up = document.getElementById("amb_up");
const volumeSlider = document.getElementById("fader");
const faderValue = document.getElementById("fader-value");

const progressCover = document.getElementById("progress-cover");

let tracks = [t1, t2, t3, t4, t5, t6, t7, t8]
let t = null;
let index = 0;

let vol = volumeSlider.value;
const TIME = 1000;

let isPlaying = false;

tracks.forEach(track => {
    track.volume = 0.3;
    track.loop = true;
});


function fadeIn(audio) {
    // Si un fade est déjà en cours sur cette piste, on l'arrête
    if (audio.fadeTimer) {
        clearInterval(audio.fadeTimer);
    }

    let progress = 0;
    let steps = vol / 0.01;
    let interval = TIME / steps;

    audio.fadeTimer = setInterval(() => {
        progress += 0.01 / vol;
        if (progress >= 1) {
            audio.volume = vol;
            clearInterval(audio.fadeTimer);
            audio.fadeTimer = null;
        } else {
            audio.volume = vol * Math.sqrt(progress);
        }
    }, interval);
}

function fadeOut(audio) {
    // Si un fade est déjà en cours sur cette piste, on l'arrête
    if (audio.fadeTimer) {
        clearInterval(audio.fadeTimer);
    }

    let progress = 1;
    let steps = vol / 0.01;
    let interval = TIME / steps;

    audio.fadeTimer = setInterval(() => {
        progress -= 0.01 / vol;

        if (progress <= 0) {
            audio.volume = 0;
            clearInterval(audio.fadeTimer);
            audio.fadeTimer = null;
        } else {
            audio.volume = vol * Math.sqrt(progress);
        }
    }, interval);
}

function startAudio() {
    tracks.forEach(track => {
        track.play();
        track.volume = 0;
    });

    if (t === null) t = t1;

    t.volume = vol;

    if (index < 7) {
        amb_up.classList.remove("btn-disabled");
    }

    if (index > 0) {
        amb_down.classList.remove("btn-disabled");
    }

    playStopBtn.innerHTML = "<strong>Stop</strong>";
    isPlaying = true;

    updateProgressBar();
}

function stopAudio() {
    tracks.forEach(track => {
        if (track.fadeTimer) {
            clearInterval(track.fadeTimer);
            track.fadeTimer = null;
        }
        track.pause();
        track.currentTime = 0;
    });

    amb_down.classList.add("btn-disabled");
    amb_up.classList.add("btn-disabled");

    playStopBtn.innerHTML = "<strong>Play</strong>";
    isPlaying = false;
}

function updateProgressBar() {
    // Calcule la portion non atteinte (de 87.5% pour t1 jusqu'à 0% pour t8)
    let percentage = 100 - (((index + 1) / 8) * 100);
    progressCover.style.width = percentage + "%";
}

playStopBtn.addEventListener("click", () => {
    if (!isPlaying) startAudio();
    else stopAudio();
});

function disable_btns_tmp() {
    if (index > 0) {
        amb_down.classList.add("btn-disabled");
        setTimeout(() => {
            amb_down.classList.remove("btn-disabled");
        }, TIME);
    }

    if (index < 7) {
        amb_up.classList.add("btn-disabled");
        setTimeout(() => {
            amb_up.classList.remove("btn-disabled");
        }, TIME);
    }
}

amb_down.addEventListener("click", () => {
    if (index === 0) return;

    fadeOut(t);
    index -= 1;
    t = tracks[index];
    fadeIn(t);

    if (index === 6) {
        amb_up.classList.remove("btn-disabled");
    } else if (index === 0) {
        amb_down.classList.add("btn-disabled");
    }

    disable_btns_tmp();

    updateProgressBar();
});

amb_up.addEventListener("click", () => {
    if (index === 7) return;
    
    fadeOut(t);
    index += 1;
    t = tracks[index];
    fadeIn(t);

    if (index === 1) {
        amb_down.classList.remove("btn-disabled");
    } else if (index === 7) {
        amb_up.classList.add("btn-disabled");
    }

    disable_btns_tmp();

    updateProgressBar();
});

volumeSlider.addEventListener("input", () => {
    vol = volumeSlider.value;

    let val = Math.round(vol * 100);
    faderValue.textContent = String(val);

    if (isPlaying) t.volume = vol;
});
