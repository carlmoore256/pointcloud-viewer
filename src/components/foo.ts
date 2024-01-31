

    // function parseParameters() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     // parse params
    // }

    // function setSearchParameters() {
    //     console.log("setSearchParameters");
    //     const urlParams = new URLSearchParams(window.location.search);

    //     const pointCloudParams = {
    //         colorThreshold,
    //         depthThreshold,
    //         pointSize,
    //         depthScale,
    //         useOrthographic,
    //         statsType,
    //     };

    //     const encodedPointCloudParams = btoa(JSON.stringify(pointCloudParams)); // Base64 encode

    //     urlParams.set("pointCloudParameters", encodedPointCloudParams);

    //     // Update the URL without reloading the page, keeping other parameters intact
    //     window.history.replaceState(
    //         {},
    //         "",
    //         `${window.location.pathname}?${urlParams.toString()}`
    //     );
    // }

    // function parseParameters() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const encodedPointCloudParams = urlParams.get("pointCloudParameters");

    //     if (encodedPointCloudParams) {
    //         try {
    //             const pointCloudParamsJson = atob(encodedPointCloudParams); // Base64 decode
    //             const pointCloudParams = JSON.parse(pointCloudParamsJson);

    //             colorThreshold =
    //                 pointCloudParams.colorThreshold || colorThreshold;
    //             depthThreshold =
    //                 pointCloudParams.depthThreshold || depthThreshold;
    //             pointSize = pointCloudParams.pointSize || pointSize;
    //             depthScale = pointCloudParams.depthScale || depthScale;
    //             useOrthographic =
    //                 "useOrthographic" in pointCloudParams
    //                     ? pointCloudParams.useOrthographic
    //                     : useOrthographic;
    //             statsType = pointCloudParams.statsType || statsType;
    //         } catch (error) {
    //             console.error("Error parsing pointCloudParameters:", error);
    //             // Handle error or set default values
    //         }
    //     }
    // }
