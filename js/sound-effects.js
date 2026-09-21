import { getWaveform, drawWaveform } from "/js/waveform.js";


fetch("/json/soundEffects.json")
    .then(r => r.json())
    .then(async files => {

        const table = document.getElementById("audio-table");
        const player = document.getElementById("player");
        const fader = document.getElementById("fader");
        const faderValue = document.getElementById("fader-value");

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const nbrCol = 2;

        let col = 1;
        let vol = fader.value;
        let row;

        let previousCell = null;
        let animId = null;

        player.volume = 0.3;

        fader.addEventListener("input", () => {
                vol = fader.value;

                let val = Math.round(vol * 100);
                faderValue.textContent = String(val);

                player.volume = vol;
        });

        for (const file of files) {

            // Vérifier extension
            if (!file.toLowerCase().endsWith(".mp3")) {
                console.warn("Ignoré (pas mp3) :", file);
                continue;
            }

            // Vérifier la validité du MP3
            let audioBuffer;

            try {
                const response = await fetch("/assets/soundEffects/" + file);

                if (!response.ok) {
                    throw new Error("Fichier introuvable");
                }

                const buf = await response.arrayBuffer();
                audioBuffer = await audioCtx.decodeAudioData(buf);

            } catch (error) {
                console.warn("MP3 invalide :", file, error);
                continue;
            }

            if (col === 1) {
                row = document.createElement("tr");
            }

            const cell = document.createElement("td");
            const name = file.replace(/\.[^/.]+$/, "");

            const nameElement = document.createElement("span");
            nameElement.textContent = name;
            nameElement.style.position = "relative";
            nameElement.style.zIndex = "1";

            cell.appendChild(nameElement);

            const canvas = document.createElement("canvas");
            canvas.width = 210;
            canvas.height = 30;

            const waveform = getWaveform(audioBuffer, canvas.width);

            drawWaveform(canvas, waveform);

            const waveformImage = canvas.toDataURL("image/png");

            cell.style.setProperty("--waveform", `url(${waveformImage})`);

            // Lecture du son
            cell.onclick = () => {
                if (previousCell !== cell || player.paused) {

                    if (previousCell) {
                        if (player.paused === false && animId) {
                            cancelAnimationFrame(animId);
                            previousCell.style.setProperty("--wave-clip", "0%");
                        }
                    }

                    previousCell = cell;

                    player.src = "/assets/soundEffects/" + file;
                    player.play();

                    const updateWaveform = () => {
                        if (!player.duration) {
                            animId = requestAnimationFrame(updateWaveform);
                            return;
                        }

                        const progress = player.currentTime / player.duration;

                        cell.style.setProperty(
                            "--wave-clip",
                            `${100 - progress * 100}%`
                        );

                        if (!player.ended) {
                            animId = requestAnimationFrame(updateWaveform);
                        }
                    };

                    cell.style.setProperty("--wave-clip", "100%");
                    animId = requestAnimationFrame(updateWaveform);
                }
            };

            row.appendChild(cell);

            if (col === nbrCol) {
                table.appendChild(row);
                row = null;
                col = 1;
            } else {
                col++;
            }
        }

        if (col != 1) {
            for (let i = col; i <= nbrCol; i++) {
                const empty = document.createElement("td");
                row.appendChild(empty);
            }
            table.appendChild(row);
        }
    });
