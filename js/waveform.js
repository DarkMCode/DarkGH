export function getWaveform(audioBuffer, samples) {
    const data = audioBuffer.getChannelData(0);
    const blockSize = Math.max(1, Math.floor(data.length / samples));

    const waveform = [];

    for (let i = 0; i < samples; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, data.length);

        let min = 1;
        let max = -1;

        for (let j = start; j < end; j++) {
            const value = data[j];

            if (value < min) min = value;
            if (value > max) max = value;
        }

        waveform.push({ min, max });
    }

    return waveform;
}

export function drawWaveform(canvas, waveform) {
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const middle = height / 2;

    ctx.clearRect(0, 0, width, height);

    const step = width / waveform.length;

    for (let i = 0; i < waveform.length; i++) {

        const { min, max } = waveform[i];

        const x = i * step;

        const yMin = middle + min * middle;
        const yMax = middle + max * middle;

        ctx.beginPath();
        ctx.moveTo(x, yMin);
        ctx.lineTo(x, yMax);
        ctx.stroke();
    }
}