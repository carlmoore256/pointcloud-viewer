<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";
    import { frameStore } from "../stores/frame-store";

    import {
        ImagePointCloud,
        type ImagePointsParameters,
    } from "../model/ImagePointCloud";
    import { getImageData } from "../model/utils";

    export let colorImageSrc: string;
    export let depthImageSrc: string;
    export let backgroundColor: THREE.Color = new THREE.Color("rgb(0, 0, 0)");
    export let parameters: ImagePointsParameters;
    export let useOrthographicCamera: boolean = false;

    let container: HTMLElement;
    let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let depthTexture: THREE.Texture;
    let colorTexture: THREE.Texture;
    let controls: OrbitControls;
    let imagePoints: ImagePointCloud;
    let animationFrameId: number;

    let beginFrame: () => void;
    let endFrame: () => void;

    frameStore.subscribe((value) => {
        ({ beginFrame, endFrame } = value);
    });

    onMount(() => {
        initScene();
        return () => {
            disposeScene();
        };
    });

    onDestroy(() => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        disposeScene();
    });

    function disposeScene() {
        if (imagePoints) {
            scene.remove(imagePoints.points);
            imagePoints.dispose();
        }
    }

    $: {
        if (parameters && imagePoints) {
            updateScene();
        }
    }

    $: if (depthTexture && colorTexture) {
        updateScene();
    }

    function updateScene() {
        if (imagePoints) {
            scene.remove(imagePoints.points);
            imagePoints.dispose();
        }

        imagePoints = new ImagePointCloud(
            getImageData(colorTexture),
            getImageData(depthTexture),
            parameters
        );
        scene.add(imagePoints.points);

        // Only start the animation loop if it hasn't been started yet
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    function initScene() {
        if (imagePoints) {
            scene.remove(imagePoints.points);
            imagePoints.dispose();
        }
        scene = new THREE.Scene();
        scene.background = backgroundColor;
        const aspectRatio = window.innerWidth / window.innerHeight;
        if (useOrthographicCamera) {
            camera = new THREE.OrthographicCamera(
                -aspectRatio,
                aspectRatio,
                1,
                -1,
                0.01,
                1000
            );
        } else {
            camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        }
        camera.position.set(0, 0, 3);
        // Renderer setup
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        // Orbit camera setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.update();
        // Load textures
        const loader = new THREE.TextureLoader();
        loader.load(depthImageSrc, (data) => {
            depthTexture = data;
        });
        loader.load(colorImageSrc, (data) => {
            colorTexture = data;
        });
    }

    function onWindowResize() {
        if (camera.type === "OrthographicCamera") {
            // const aspectRatio = window.innerWidth / window.innerHeight;
            // camera.left = -aspectRatio;
            // camera.right = aspectRatio;
            // camera.top = 1;
            // camera.bottom = -1;
        } else {
            // @ts-ignore
            camera.aspect = window.innerWidth / window.innerHeight;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function updatePoints() {
        const time = Date.now() * 0.005;
        imagePoints.iteratePositions((x, y, z, index) => {
            const offset = index * 2 * Math.PI;
            x += Math.sin(time + offset) * 0.001;
            y += Math.sin(time + offset) * 0.001;
            z += Math.sin(time + offset) * 0.001;
            return [x, y, z];
        });
    }

    function animate() {
        beginFrame();
        renderer.render(scene, camera);
        controls.update();
        animationFrameId = requestAnimationFrame(animate);
        endFrame();
    }
</script>

<svelte:window on:resize={onWindowResize} />

<div bind:this={container}></div>
<div id="canvas-container"></div>

<!-- <canvas id="hidden-canvas"></canvas> -->

<style>
    .hidden-canvas {
        display: none;
    }
</style>
