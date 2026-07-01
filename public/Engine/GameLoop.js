"use strict";
let lastFrameTime;
let tickEvent;
const loopDetail = { dTime: 0 };
let vsyncEnabled = true;
let targetFps = 60;
let accumulator = 0;
const Initialize = () => {
    lastFrameTime = performance.now();
    tickEvent = new CustomEvent('GameLoop:Update', { detail: loopDetail });
    window.addEventListener('Game:VsyncToggled', ((event) => {
        const detail = event.detail;
        vsyncEnabled = detail.enabled;
        if (!vsyncEnabled) {
            targetFps = detail.targetFps;
            accumulator = 0;
        }
    }));
    window.requestAnimationFrame(GameLoop);
};
const GameLoop = (now) => {
    const rawDelta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    if (vsyncEnabled) {
        loopDetail.dTime = Math.min(rawDelta, 1 / 15);
        window.dispatchEvent(tickEvent);
    }
    else {
        const frameStep = 1 / targetFps;
        accumulator += rawDelta;
        if (accumulator > 3 * frameStep) {
            accumulator = frameStep;
        }
        if (accumulator >= frameStep) {
            loopDetail.dTime = frameStep;
            window.dispatchEvent(tickEvent);
            accumulator -= frameStep;
        }
    }
    window.requestAnimationFrame(GameLoop);
};
Initialize();
