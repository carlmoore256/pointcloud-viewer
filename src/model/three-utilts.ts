import * as THREE from 'three';

// export function disposeScene(scene: THREE.Scene, renderer?: THREE.WebGLRenderer) {
//     // Dispose geometries, materials, textures, etc.
//     scene.traverse((object) => {
//         if (object.isMesh) {
//             object.geometry.dispose();
//             if (object.material.isMaterial) {
//                 cleanMaterial(object.material);
//             } else {
//                 // In case of multi-material
//                 for (const material of object.material) cleanMaterial(material);
//             }
//         }
//     });

//     if (renderer) {
//         renderer.dispose();
//     }
// }
