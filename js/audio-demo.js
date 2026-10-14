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

let isPlaying = false;

t1.volume = 0.3;
t2.volume = 0.3;
t3.volume = 0.3;
t4.volume = 0.3;
t5.volume = 0.3;
t6.volume = 0.3;
t7.volume = 0.3;
t8.volume = 0.3;

function fadeIn(audio) {
    let v = audio.volume;
    const interval = setInterval(() => {
        v += 0.01;
        if (v >= vol) {
            audio.volume = vol;
            clearInterval(interval);
        } else {
            audio.volume = v;
        }
    }, 90);
}

function fadeOut(audio) {
    let v = audio.volume;
    const interval = setInterval(() => {
        v -= 0.01;
        if (v <= 0) {
            audio.volume = 0;
            clearInterval(interval);
        } else {
            audio.volume = v;
        }
    }, 90);
}

function startAudio() {
    t1.play();
    t2.play();
    t3.play();
    t4.play();
    t5.play();
    t6.play();
    t7.play();
    t8.play();

    t1.volume = 0;
    t2.volume = 0;
    t3.volume = 0;
    t4.volume = 0;
    t5.volume = 0;
    t6.volume = 0;
    t7.volume = 0;
    t8.volume = 0;

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
    t1.pause();
    t1.currentTime = 0;
    t2.pause();
    t2.currentTime = 0;
    t3.pause();
    t3.currentTime = 0;
    t4.pause();
    t4.currentTime = 0;
    t5.pause();
    t5.currentTime = 0;
    t6.pause();
    t6.currentTime = 0;
    t7.pause();
    t7.currentTime = 0;
    t8.pause();
    t8.currentTime = 0;

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

amb_down.addEventListener("click", () => {
    if (index === 0) return;

    fadeOut(t);
    index -= 1;
    t = tracks[index];
    fadeIn(t);

    if (index === 6) {
        amb_up.classList.remove("btn-disabled");
    }

    if (index === 0) {
        amb_down.classList.add("btn-disabled");
    }

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
    }

    if (index === 7) {
        amb_up.classList.add("btn-disabled");
    }

    updateProgressBar();
});

volumeSlider.addEventListener("input", () => {
    vol = volumeSlider.value;

    let val = Math.round(vol * 100);
    faderValue.textContent = String(val);

    if (isPlaying) t.volume = vol;
});
