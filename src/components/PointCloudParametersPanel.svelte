<script lang="ts">
    import type { ImagePointsParameters } from "../model/ImagePointCloud";
    import type { StatsPanelType } from "../model/types";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    export let onParametersChanged: (parameters: ImagePointsParameters) => void;

    let isInitialized = false;
    let isExpanded = false;

    let pointCloudParameters = {
        colorThreshold: 0.0,
        depthThreshold: 0.0,
        pointSize: 0.006,
        depthScale: 1,
        useOrthographic: false,
        statsType: "fps", // assuming 'fps' is a default value
    };

    function parseParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = urlParams.get("params");

        if (params) {
            try {
                const decodedParams = atob(params); // Base64 decode
                console.log("decoded", decodedParams);
                const parsedParams = JSON.parse(decodedParams);
                pointCloudParameters = {
                    ...pointCloudParameters,
                    ...parsedParams,
                };
            } catch (error) {
                console.error("Error parsing URL parameters:", error);
            }
        }
    }

    onMount(() => {
        parseParameters();
        isInitialized = true;
    });

    function setUrlParameters() {
        if (!isInitialized) {
            return;
        }
        console.log(JSON.stringify(pointCloudParameters));
        const encodedParams = btoa(JSON.stringify(pointCloudParameters)); // Base64 encode
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("params", encodedParams);
        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${urlParams}`
        );
    }

    $: setUrlParameters(), pointCloudParameters;
    $: onParametersChanged(pointCloudParameters);
</script>

{#if isExpanded}
    <div class="controls" transition:slide={{duration: 300}}>
        <button on:click={() => (isExpanded = false)}>Hide Controls</button>

        <label for="color-threshold">Color Threshold</label>
        <input
            class="range"
            type="range"
            id="color-threshold"
            min="0"
            max="1"
            step="0.01"
            bind:value={pointCloudParameters.colorThreshold}
        />

        <label for="depth-threshold">Depth Threshold</label>
        <input
            class="range"
            type="range"
            id="depth-threshold"
            min="0"
            max="1"
            step="0.01"
            bind:value={pointCloudParameters.depthThreshold}
        />

        <label for="point-size">Point Size</label>
        <input
            class="range"
            type="range"
            id="point-size"
            min="0.0001"
            max="0.1"
            step="0.0001"
            bind:value={pointCloudParameters.pointSize}
        />

        <label for="depth-scale">Depth Scale</label>
        <input
            class="range"
            type="range"
            id="depth-scale"
            min="0.1"
            max="10"
            step="0.1"
            bind:value={pointCloudParameters.depthScale}
        />

        <label for="use-orthographic">Use Orthographic</label>
        <input
            type="checkbox"
            id="use-orthographic"
            bind:checked={pointCloudParameters.useOrthographic}
        />

        <label for="stats-type">Stats Type</label>
        <select id="stats-type" bind:value={pointCloudParameters.statsType}>
            <option value="fps">FPS</option>
            <option value="ms">MS</option>
            <option value="mb">MB</option>
            <option value="custom">Custom</option>
        </select>
    </div>
{:else}
    <div class="controls-hidden">
        <button on:click={() => (isExpanded = true)}>Show Controls</button>
    </div>
{/if}

<style>
    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 2rem;
        background-color: #2c3e5071; /* Dark background for contrast */
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* Spacing between controls */
        color: #ecf0f1; /* Light text color for contrast */
        font-family: "Arial", sans-serif;
        width: 25%; /* Fixed width */
        backdrop-filter: blur(10px); /* Blur background */
        margin: 10px;
    }

    button {
        padding: 0.4rem;
        border-radius: 0.25rem;
        background-color: #bdc3c7;
        border: none;
        color: #34495e;
        cursor: pointer;
    }

    .controls-hidden {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0.5rem;
    }
    
    label {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    select {
        padding: 0.5rem;
        border-radius: 0.25rem;
        background-color: white;
        border: 1px solid #bdc3c7;
        color: #34495e;
        cursor: pointer;
    }
</style>
