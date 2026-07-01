import { GameElement } from "../Engine/GameElement.js";
import "../Utils/NumberUtils.js";
import RoutineManager from "./DotRoutineManager.js";

export class Dot extends GameElement
{
    dotElement: HTMLElement;
    velocity: number = 3;
    dTime: number = 0;
    calibrationScale: number = 1.0;
    safeAreaMaxY: number = 100;

    get halfScreen(): number
    {
        return 50;
    }

    constructor(dotElement: HTMLElement)
    {
        let gameElementInstance: GameElement | null = null;
        super(dotElement, gameElementInstance);
        gameElementInstance = this;
        this.dotElement = dotElement;

        window.addEventListener('Game:VelocityValueChanged', (event: Event) => {
            this.velocity = (event as CustomEvent).detail.velocity;
        });

        window.addEventListener('Game:RadiusValueChanged', (event: Event) => {
            this.Radius = (event as CustomEvent).detail.radius;
        });

        this.recalculateSafeArea();
        window.addEventListener('resize', () => this.recalculateSafeArea());
    }

    get Radius(): number
    {
        return parseFloat(getComputedStyle(this.dotElement).getPropertyValue("--radius"));
    }

    set Radius(value: number)
    {
        this.dotElement.style.setProperty("--radius", value.toString());
    }

    set Y(value: number)
    {
        const clamped = Math.min(value, this.safeAreaMaxY);
        this.htmlElement.style.setProperty("--y", clamped.toString());
    }

    get Y(): number
    {
        return parseFloat(getComputedStyle(this.htmlElement).getPropertyValue("--y"));
    }

    Update(dTime: number): void
    {
        this.dTime = dTime;
        RoutineManager.activeDotRoutines[RoutineManager.currentRoutineIndex].Execute(this);
    }

    recalculateSafeArea(): void
    {
        const ui = document.querySelector('.ui-controls') as HTMLElement | null;
        if (ui)
        {
            const uiHeight = ui.offsetHeight;
            const vh = window.innerHeight;
            this.safeAreaMaxY = Math.max(50, 100 - (uiHeight / vh * 100));
        }
        else
        {
            this.safeAreaMaxY = 100;
        }
    }
}
