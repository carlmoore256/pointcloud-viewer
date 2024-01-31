<!-- StatsFPS.svelte -->
<script lang="ts">
    import Stats from "stats.js";
    import { onMount, onDestroy } from "svelte";
    import { frameStore } from "../stores/frame-store";
    import type { StatsPanelType } from "../model/types";

    export let panelType: StatsPanelType = "fps";

    let stats: Stats;
    let statsContainer: HTMLElement;

    function getPanelType(panelType: StatsPanelType): number {
        switch (panelType) {
            case "fps":
                return 0;
            case "ms":
                return 1;
            case "mb":
                return 2;
            default:
                return 0;
        }
    }

    $: panelType, reset();

    function reset() {
        // if (stats) {
        //     statsContainer.removeChild(stats.dom);
        // }
        if (!statsContainer) return;
        stats = new Stats();
        stats.showPanel(getPanelType(panelType)); // 0: fps, 1: ms, 2: mb, etc.
        statsContainer.appendChild(stats.dom);
        stats.begin();

        // Update the store with the stats methods
        frameStore.set({
            beginFrame: () => stats.begin(),
            endFrame: () => stats.end(),
        });
    }

    onMount(() => {
        reset();
        return () => {
            statsContainer.removeChild(stats.dom);
        };
    });

    onDestroy(() => {
        statsContainer.removeChild(stats.dom);
        frameStore.set({ beginFrame: () => {}, endFrame: () => {} }); // Reset the store
    });
</script>

<div class="stats" bind:this={statsContainer}></div>

<style>
    .stats {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
    }
</style>
