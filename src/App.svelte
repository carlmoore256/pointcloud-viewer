<script lang="ts">
    import PointCloudCanvas from "./components/PointCloudCanvas.svelte";
    import PointCloudParametersPanel from "./components/PointCloudParametersPanel.svelte";
    import Stats from "./components/Stats.svelte";
    import * as THREE from "three";
    import type { StatsPanelType } from "./model/types";
    import { onMount } from "svelte";
    import { color } from "three/examples/jsm/nodes/Nodes.js";
    import type { ImagePointsParameters } from "./model/ImagePointCloud";

    let statsType: StatsPanelType = "fps";
    let imageName: string | null = null;
    let useOrthographic = false;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const imageParam = urlParams.get("image");
        if (imageParam) {
            imageName = imageParam;
        }
    });

    $: colorImageSrc = `${imageName}.color.png`;
    $: depthImageSrc = `${imageName}.depth.png`;

    let parameters: ImagePointsParameters | null = null;

    function onParametersChanged(_parameters: ImagePointsParameters) {
        parameters = { ..._parameters };
    }
</script>

<main>

    <input type="range" min="0" max="100" value="40" class="range" />

    <Stats panelType={statsType} />

    {#if imageName === null}
        <h1>Image not found</h1>
    {:else if parameters === null}
        <h1>Parameters not found</h1>
    {:else}
        <PointCloudCanvas
            {colorImageSrc}
            {depthImageSrc}
            {parameters}
            useOrthographicCamera={useOrthographic}
        />
    {/if}
    <!-- create slider for color and depth thresholds -->

    <PointCloudParametersPanel {onParametersChanged} />
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>
