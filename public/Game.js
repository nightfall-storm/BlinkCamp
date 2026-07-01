import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { initThemeManager } from "./ThemeManager.js";
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    initThemeManager();
    SetupVsyncControls();
    SubscribeToRoutineChangedEvent();
};
const SetLeftArrowEvent = () => {
    const event = new CustomEvent('Game:LeftArrowClick');
    const el = document.querySelector(".arrow.left");
    el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        window.dispatchEvent(event);
    });
};
const SetRightArrowEvent = () => {
    const event = new CustomEvent('Game:RightArrowClick');
    const el = document.querySelector(".arrow.right");
    el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        window.dispatchEvent(event);
    });
};
const SetVelocityChangeEvent = () => {
    const slider = document.getElementById("velocityslider");
    const event = new CustomEvent('Game:VelocityValueChanged', {
        detail: { velocity: slider.value }
    });
    slider.addEventListener("input", () => {
        event.detail.velocity = slider.value;
        window.dispatchEvent(event);
    });
};
const SetRadiusChangeEvent = () => {
    const slider = document.getElementById("sizeslider");
    const event = new CustomEvent('Game:RadiusValueChanged', {
        detail: { radius: slider.value }
    });
    slider.addEventListener("input", () => {
        event.detail.radius = slider.value;
        window.dispatchEvent(event);
    });
};
const SetupVsyncControls = () => {
    const toggle = document.getElementById("vsync-toggle");
    const fpsSlider = document.getElementById("fps-slider");
    const fpsValue = document.getElementById("fps-value");
    const fpsContainer = document.getElementById("fps-cap-container");
    const dispatch = () => {
        const enabled = toggle.checked;
        const targetFps = parseInt(fpsSlider.value);
        window.dispatchEvent(new CustomEvent('Game:VsyncToggled', {
            detail: { enabled, targetFps }
        }));
        fpsContainer.style.display = enabled ? "none" : "flex";
    };
    toggle.addEventListener("change", dispatch);
    fpsSlider.addEventListener("input", () => {
        fpsValue.textContent = fpsSlider.value;
        if (!toggle.checked)
            dispatch();
    });
};
InitializeScene();
