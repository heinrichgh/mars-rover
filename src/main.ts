import InputParser from "./input-parser";
import {PlacedRover} from "./grid";
import {DirectionToString} from "./direction";
import Engine from "./engine";

// TODO:
// Mini-map
// Camera zoom out at the end?



///////////////////////////////
// const inputText = `
// 5 5
// 1 2 N
// LMLMLMLMM
// 3 3 E
// MMRMMRMRRM`;
// const inputText = `
// 100 100
// 1 2 N
// RRRR
// 3 3 E
// LLLL
// 60 80 S
// RLRL
// 62 82 S
// RRLLRRLL`;
//////////////////////////////////////////

const engine = new Engine();

let inputCommandTextarea = <HTMLTextAreaElement>document.getElementById("commandInput");
let actions = <HTMLTextAreaElement>document.getElementById("actions");
let inputError = document.getElementById("inputError");
let notRunningActions = document.getElementById("notRunningActions");
let runningActions = document.getElementById("runningActions");

let toggleActions = document.getElementById("toggleActionsBtn");
let actionsShowing = true;
toggleActions.addEventListener("click", (event) => {
    actionsShowing = !actionsShowing;
   if (actionsShowing) {
       actions.classList.remove("d-none");
   } else {
       actions.classList.add("d-none");
   }
});

let initButton = document.getElementById("btnInit");
initButton.addEventListener("click", (event) => {
    inputError.classList.add("d-none");
    const inputText = inputCommandTextarea.value;
    const parser = new InputParser();
    try {
        const parsed = parser.parse(inputText);
        engine.init(parsed);
        inputCommandTextarea.readOnly = true;
        notRunningActions.classList.add("d-none");
        runningActions.classList.remove("d-none");
    } catch (e) {
        inputError.innerHTML = e;
        inputError.classList.remove("d-none");
    }
});

let pauseButton = document.getElementById("btnPause");
pauseButton.addEventListener("click", (event) => {
    if (engine.togglePause()) {
        pauseButton.innerHTML = "Resume";
    } else {
        pauseButton.innerHTML = "Pause";
    }
});

let stopButton = document.getElementById("btnStop");
stopButton.addEventListener("click", (event) => {
    engine.stop();
    inputCommandTextarea.readOnly = false;
    notRunningActions.classList.remove("d-none");
    runningActions.classList.add("d-none");
});

let output = document.getElementById("output");
function updateOutput(placedRovers: PlacedRover[]) {
    let outputString = "";

    for (let placed of placedRovers) {
        outputString += `${placed.rover.position.x} ${placed.rover.position.y} ${DirectionToString(placed.rover.direction)}<br>`
    }

    console.log(outputString);
    output.innerHTML = outputString;
}

let last: number;
let dt = 0;
let step = 1 / 60.0;

function frame(now: number) {
    if (!last) last = now;

    dt = Math.min((now - last) / 1000);

    while (dt > step) {
        dt = dt - step;
        let placedRovers = engine.update(step);
        if (placedRovers) {
            updateOutput(placedRovers);
        }
    }
    engine.render();
    last = now;
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
