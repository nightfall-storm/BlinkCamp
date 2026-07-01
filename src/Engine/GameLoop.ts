let lastFrameTime: number;
let tickEvent: CustomEvent;
const loopDetail = { dTime: 0 };

let vsyncEnabled = true;
let targetFps = 60;
let accumulator = 0;

const Initialize = (): void => {
    lastFrameTime = performance.now();
    tickEvent = new CustomEvent('GameLoop:Update', { detail: loopDetail });

    window.addEventListener('Game:VsyncToggled', ((event: Event) => {
        const detail = (event as CustomEvent).detail;
        vsyncEnabled = detail.enabled;
        if (!vsyncEnabled) {
            targetFps = detail.targetFps;
            accumulator = 0;
        }
    }) as EventListener);

    window.requestAnimationFrame(GameLoop);
};

const GameLoop = (now: number): void => {
    const rawDelta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (vsyncEnabled) {
        loopDetail.dTime = Math.min(rawDelta, 1 / 15);
        window.dispatchEvent(tickEvent);
    } else {
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
