const t1 = document.getElementById("low");
const t2 = document.getElementById("mid");
const t3 = document.getElementById("boss");

const playStopBtn = document.getElementById("playStopBtn");
const amb1 = document.getElementById("amb-low");
const amb2 = document.getElementById("amb-mid");
const amb3 = document.getElementById("amb-boss");
const volumeSlider = document.getElementById("fader");
const faderValue = document.getElementById("fader-value");

let vol = volumeSlider.value;

let isPlaying = {
    global: false,
    t1: false,
    t2: false,
    t3: false
};

t1.volume = 0.3;
t2.volume = 0.3;
t3.volume = 0.3;

function fadeIn(audio) {
    let v = audio.volume;
    const interval = setInterval(() => {
        v += 0.01;
        audio.volume = v;
        if (v >= vol) clearInterval(interval);
    }, 90);
}

function fadeOut(audio) {
    let v = audio.volume;
    const interval = setInterval(() => {
        v -= 0.01;
        audio.volume = v;
        if (v <= 0) clearInterval(interval);
    }, 90);
}

function startAudio() {
    t1.play();
    t2.play();
    t3.play();

    t1.volume = vol;
    t2.volume = 0;
    t3.volume = 0;

    amb2.classList.remove("btn-disabled");
    amb3.classList.remove("btn-disabled");

    playStopBtn.innerHTML = "<strong>Stop</strong>";
    isPlaying.global = true;
    isPlaying.t1 = true;
}

function stopAudio() {
    t1.pause();
    t1.currentTime = 0;
    t2.pause();
    t2.currentTime = 0;
    t3.pause();
    t3.currentTime = 0;

    amb1.classList.add("btn-disabled");
    amb2.classList.add("btn-disabled");
    amb3.classList.add("btn-disabled");

    playStopBtn.innerHTML = "<strong>Play</strong>";
    isPlaying.global = false;
    isPlaying.t1 = false;
    isPlaying.t2 = false;
    isPlaying.t3 = false;
}

playStopBtn.addEventListener("click", () => {
    if (!isPlaying.global) startAudio();
    else stopAudio();
});

amb1.addEventListener("click", () => {
    if (isPlaying.t2) {
        fadeOut(t2);
        isPlaying.t2 = false;
        amb2.classList.remove("btn-disabled");
    }
    else if (isPlaying.t3) {
        fadeOut(t3);
        isPlaying.t3 = false;
        amb3.classList.remove("btn-disabled");
    }
    else
        return;

    fadeIn(t1);
    isPlaying.t1 = true
    amb1.classList.add("btn-disabled");
});

amb2.addEventListener("click", () => {
    if (isPlaying.t1) {
        fadeOut(t1);
        isPlaying.t1 = false;
        amb1.classList.remove("btn-disabled");
    }
    else if (isPlaying.t3) {
        fadeOut(t3);
        isPlaying.t3 = false;
        amb3.classList.remove("btn-disabled");
    }
    else
        return;

    fadeIn(t2);
    isPlaying.t2 = true
    amb2.classList.add("btn-disabled");
});

amb3.addEventListener("click", () => {
    if (isPlaying.t1) {
        fadeOut(t1);
        isPlaying.t1 = false;
        amb1.classList.remove("btn-disabled");
    }
    else if (isPlaying.t2) {
        fadeOut(t2);
        isPlaying.t2 = false;
        amb2.classList.remove("btn-disabled");
    }
    else
        return;

    fadeIn(t3);
    isPlaying.t3 = true
    amb3.classList.add("btn-disabled");
});

volumeSlider.addEventListener("input", () => {
    vol = volumeSlider.value;

    let val = Math.round(vol * 100);
    faderValue.textContent = String(val);

    if (isPlaying.t1) t1.volume = vol;
    if (isPlaying.t2) t2.volume = vol;
    if (isPlaying.t3) t3.volume = vol;
});
