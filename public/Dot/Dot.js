import { GameElement } from "../Engine/GameElement.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";
export class Dot extends GameElement {
    get halfScreen() {
        return 50;
    }
    constructor(dotElement) {
        let gameElementInstance = null;
        super(dotElement, gameElementInstance);
        this.velocity = 3;
        this.dTime = 0;
        this.calibrationScale = 1.0;
        this.safeAreaMaxY = 100;
        gameElementInstance = this;
        this.dotElement = dotElement;
        window.addEventListener('Game:VelocityValueChanged', (event) => {
            this.velocity = event.detail.velocity;
        });
        window.addEventListener('Game:RadiusValueChanged', (event) => {
            this.Radius = event.detail.radius;
        });
        this.recalculateSafeArea();
        window.addEventListener('resize', () => this.recalculateSafeArea());
    }
    get Radius() {
        return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
    }
    set Radius(value) {
        this.dotElement.style.setProperty("--radius", value.toString());
    }
    set Y(value) {
        const clamped = Math.min(value, this.safeAreaMaxY);
        this.htmlElement.style.setProperty("--y", clamped.toString());
    }
    get Y() {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
    }
    Update(dTime) {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }
    recalculateSafeArea() {
        const ui = document.querySelector('.ui-controls');
        if (ui) {
            const uiHeight = ui.offsetHeight;
            const vh = window.innerHeight;
            this.safeAreaMaxY = Math.max(50, 100 - (uiHeight / vh * 100));
        }
        else {
            this.safeAreaMaxY = 100;
        }
    }
}
