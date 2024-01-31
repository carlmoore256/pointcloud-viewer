import * as THREE from "three";
import { getImageData, averageAllPixels, averageArray } from "./utils";

type ImagePoint = {
    index: number;
    vertex: THREE.Vector3;
    color: THREE.Color;
};

export type ImagePointsParameters = {
    thresholdFunction?: (colorPixel: number[], depthPixel: number) => boolean;
    materialParameters?: THREE.PointsMaterialParameters;
    depthThreshold: number;
    colorThreshold: number;
    depthScale: number;
    pointSize: number;
};

export class ImagePointCloud {
    private _geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    private _material: THREE.PointsMaterial;
    private _points: THREE.Points;
    private _parameters: ImagePointsParameters;

    public dimensions: { width: number; height: number };

    constructor(
        colorImageData: ImageData,
        depthImageData: ImageData,
        parameters: ImagePointsParameters
    ) {
        if (
            colorImageData.width !== depthImageData.width ||
            colorImageData.height !== depthImageData.height
        ) {
            throw new Error(`Image dimensions do not match (${colorImageData.width}x${colorImageData.height} vs ${depthImageData.width}x${depthImageData.height})`);
        }

        this._parameters = parameters;

        this.dimensions = {
            width: colorImageData.width,
            height: colorImageData.height,
        };

        this.processImageData(
            colorImageData,
            depthImageData,
            (colorPixel, depthPixel) => {
                const avgColor =
                    (colorPixel[0] + colorPixel[1] + colorPixel[2]) / 3;
                if (
                    avgColor > parameters.colorThreshold &&
                    (depthPixel + 0.5) > parameters.depthThreshold
                ) {
                    return true;
                }
                return false;
            }
        );

        this._material = new THREE.PointsMaterial({
            size: parameters.pointSize,
            vertexColors: true,
            ...parameters.materialParameters,
        });

        this._points = new THREE.Points(this._geometry, this._material);
    }

    get points() {
        return this._points;
    }

    get material() {
        return this._material;
    }

    get geometry() {
        return this._geometry;
    }

    get positions() {
        return this._geometry.attributes.position;
    }

    public dispose() {
        this._material.dispose();
        this._geometry.dispose();
    }

    public setMaterialParameters(parameters: THREE.PointsMaterialParameters) {
        this._material.setValues(parameters);
    }

    private dimensionsMatch(imageData: ImageData) {
        return (
            this.dimensions.width === imageData.width &&
            this.dimensions.height === imageData.height
        );
    }

    public setImageData(
        colorImageData: ImageData,
        depthImageData: ImageData,
        thresholdFunction?: (
            colorPixel: number[],
            depthPixel: number
        ) => boolean
    ) {
        if (!this.dimensionsMatch(colorImageData)) {
            throw new Error("Image dimensions do not match");
        }
        this._geometry.dispose();
        this._geometry = new THREE.BufferGeometry();
        this.processImageData(
            colorImageData,
            depthImageData,
            thresholdFunction
        );
        this._points.geometry = this._geometry;
    }

    private processImageData(
        colorImageData: ImageData,
        depthImageData: ImageData,
        thresholdFunction?: (
            colorPixel: number[],
            depthPixel: number
        ) => boolean
    ) {
        const colorData = colorImageData.data;
        const depthData = depthImageData.data;
        const width = colorImageData.width;
        const height = colorImageData.height;
        const vertices: number[] = [];
        const colors: number[] = [];

        console.log("Processing image data");

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const colorPixel = [
                    colorData[i] / 255,
                    colorData[i + 1] / 255,
                    colorData[i + 2] / 255,
                    colorData[i + 3] / 255,
                ];
                const depthPixel = averageArray([
                    depthData[i] / 255,
                    depthData[i + 1] / 255,
                    depthData[i + 2] / 255,
                ]) - 0.5;

                // console.log(depthPixel);

                if (
                    !thresholdFunction ||
                    thresholdFunction(colorPixel, depthPixel)
                ) {
                    const posX = (x / width) * 2 - 1;
                    const posY = ((height - y) / height) * 2 - 1;
                    vertices.push(posX, posY, depthPixel * (this._parameters.depthScale || 1));
                    colors.push(...colorPixel);
                }
            }
        }

        this._geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        this._geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 4)
        );
    }

    public iteratePositions(callback: (x: number, y: number, z: number, i: number) => [number, number, number]) {
        const positions = this._geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);
            [x, y, z] = callback(x, y, z, i / positions.count); // Apply the callback to get new values
            positions.setXYZ(i, x, y, z); // Update the positions
        }
        this.positions.needsUpdate = true;
    }
}


// 4.83