// frameStore.js
import { writable } from 'svelte/store';

export const frameStore = writable({
    beginFrame: () => {},
    endFrame: () => {}
});