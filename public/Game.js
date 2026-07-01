import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { initThemeManager } from "./ThemeManager.js";
import { loadPreferences, updatePreferences, getPreferences } from "./PreferencesManager.js";
import RoutineManager, { setRoutineIndex } from "./Dot/DotRoutineManager.js";
const InitializeScene = () => {
    loadPreferences();
    const prefs = getPreferences();
    const dot = new Dot(document.getElementById("dot"));
    SetMenuToggle();
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    initThemeManager();
    SetupVsyncControls();
    SubscribeToRoutineChangedEvent();
    // Apply saved preferences to UI controls
    document.getElementById("velocityslider").value = prefs.velocity.toString();
    document.getElementById("sizeslider").value = prefs.radius.toString();
    dot.velocity = prefs.velocity;
    dot.Radius = prefs.radius;
    setRoutineIndex(prefs.routineIndex);
    const vsyncToggle = document.getElementById("vsync-toggle");
    vsyncToggle.checked = prefs.vsyncEnabled;
    const fpsSlider = document.getElementById("fps-slider");
    fpsSlider.value = prefs.targetFps.toString();
    document.getElementById("fps-value").textContent = prefs.targetFps.toString();
    document.getElementById("fps-cap-container").style.display = prefs.vsyncEnabled ? "none" : "flex";
    // Dispatch initial V-Sync state
    window.dispatchEvent(new CustomEvent('Game:VsyncToggled', {
        detail: { enabled: prefs.vsyncEnabled, targetFps: prefs.targetFps }
    }));
    // Apply saved menu state
    const ui = document.getElementById("ui-controls");
    const menuBtn = document.getElementById("menu-toggle");
    if (prefs.menuHidden) {
        ui.classList.add("hidden");
        menuBtn.textContent = "☰";
    }
    // Detect actual refresh rate (overrides saved FPS if different)
    DetectRefreshRate();
};
const SetMenuToggle = () => {
    const btn = document.getElementById("menu-toggle");
    const ui = document.getElementById("ui-controls");
    btn.addEventListener("pointerdown", () => {
        const hidden = ui.classList.toggle("hidden");
        btn.textContent = hidden ? "☰" : "✕";
        updatePreferences({ menuHidden: hidden });
    });
};
const SetLeftArrowEvent = () => {
    const event = new CustomEvent('Game:LeftArrowClick');
    const el = document.querySelector(".arrow.left");
    el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const newIndex = RoutineManager.currentRoutineIndex - 1 < 0
            ? RoutineManager.activeDotRoutines.length - 1
            : RoutineManager.currentRoutineIndex - 1;
        updatePreferences({ routineIndex: newIndex });
        window.dispatchEvent(event);
    });
};
const SetRightArrowEvent = () => {
    const event = new CustomEvent('Game:RightArrowClick');
    const el = document.querySelector(".arrow.right");
    el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const newIndex = (RoutineManager.currentRoutineIndex + 1) % RoutineManager.activeDotRoutines.length;
        updatePreferences({ routineIndex: newIndex });
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
        updatePreferences({ velocity: parseFloat(slider.value) });
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
        updatePreferences({ radius: parseFloat(slider.value) });
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
        updatePreferences({ vsyncEnabled: enabled, targetFps });
    };
    toggle.addEventListener("change", dispatch);
    fpsSlider.addEventListener("input", () => {
        fpsValue.textContent = fpsSlider.value;
        if (!toggle.checked)
            dispatch();
    });
};
const DetectRefreshRate = () => {
    const fpsSlider = document.getElementById("fps-slider");
    const fpsValue = document.getElementById("fps-value");
    const samples = [];
    let prev = performance.now();
    let count = 0;
    const sample = () => {
        const now = performance.now();
        samples.push(now - prev);
        prev = now;
        count++;
        if (count >= 10) {
            samples.sort((a, b) => a - b);
            const median = samples[Math.floor(samples.length / 2)];
            const detected = Math.round(1000 / median);
            const prefs = getPreferences();
            if (detected !== prefs.targetFps) {
                fpsSlider.value = detected.toString();
                fpsValue.textContent = detected.toString();
                updatePreferences({ targetFps: detected });
                if (!prefs.vsyncEnabled) {
                    window.dispatchEvent(new CustomEvent('Game:VsyncToggled', {
                        detail: { enabled: false, targetFps: detected }
                    }));
                }
            }
            return;
        }
        requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
};
InitializeScene();
