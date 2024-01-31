import * as THREE from "three";

export function getImageData(texture: THREE.Texture) {
    // const canvas = document.createElement("canvas");
    const container = document.getElementById("canvas-container");
    if (!container) throw new Error("Could not get canvas container");
    const canvas = container.appendChild(
        document.createElement("canvas")
    ) as HTMLCanvasElement;
    canvas.classList.add("hidden-canvas");

    if (!canvas) throw new Error("Could not get hidden canvas");
    // clear the canvas
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;

    // canvas.width = image.width;
    // canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(texture.image, 0, 0);
    const data = context.getImageData(
        0,
        0,
        texture.image.width,
        texture.image.height
    );
    // destroy the canvas
    canvas.remove();
    return data;
}

export function averageArray(arr: number[]) {
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}

export function averageAllPixels(imageData: ImageData) {
    const { data } = imageData;
    const numPixels = imageData.width * imageData.height;
    const numChannels = 4;
    const averages = new Float32Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
        const start = i * numChannels;
        // Directly access pixel values instead of slicing
        const r = data[start];
        const g = data[start + 1];
        const b = data[start + 2];
        const a = data[start + 3];
        averages[i] = (r + g + b + a) / numChannels;
    }
    return averages;
}

export function filterStepped(data: number[], filterFn: (batch: number[]) => boolean, step: number) {
    const filtered = [];
    for (let i = 0; i < data.length; i += step) {
        const batch = data.slice(i, i + step);
        if (filterFn(batch)) {
            filtered.push(...batch);
        }
    }
    return filtered;
}