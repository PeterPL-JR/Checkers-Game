const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const FIELD_SIZE = 80;
const FIELDS_IN_ROW = 8;

const BORDER_SIZE = FIELD_SIZE * FIELDS_IN_ROW;

const TYPE_LIGHT = 0;
const TYPE_DARK = 1;
let turn = TYPE_LIGHT;
const points = [];

function init() {
    canvas.width = BORDER_SIZE;
    canvas.height = BORDER_SIZE;

    points[TYPE_LIGHT] = 0;
    points[TYPE_DARK] = 0;

    canvas.onclick = function(event) {
        clickMouse(event);
    }
    canvas.onmousemove = function(event) {
        moveMouse(event);
    }

    initCheckers();
    update();
}

function update() {
    requestAnimationFrame(update);
    render();    
}
function render() {
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, BORDER_SIZE, BORDER_SIZE);

    renderBoard();
    renderCheckers();
}

function renderBoard() {
    for(let x = 0; x < FIELDS_IN_ROW; x++) {
        for(let y = 0; y < FIELDS_IN_ROW; y++) {
            let moduloX = ((x % 2) == 0) ? TYPE_LIGHT : TYPE_DARK;
            let moduloY = (y % 2) == moduloX;

            renderField(x, y, moduloY);
        }
    }
}

const FIELD_LIGHT_COLOR = "#e3c482";
const FIELD_DARK_COLOR = "#653414";

const BORDER_WIDTH = FIELD_SIZE * 0.08;
const BORDER_LIGHT_COLOR = "#a08a5b";
const BORDER_DARK_COLOR = "#351c0c";

function renderField(x, y, colorType) {
    let posX = x * FIELD_SIZE;
    let posY = y * FIELD_SIZE;

    ctx.fillStyle = colorType == TYPE_LIGHT ? FIELD_LIGHT_COLOR : FIELD_DARK_COLOR;
    ctx.fillRect(posX, posY, FIELD_SIZE, FIELD_SIZE);

    ctx.fillStyle = colorType == TYPE_LIGHT ? BORDER_LIGHT_COLOR : BORDER_DARK_COLOR;
    ctx.fillRect(posX, posY, FIELD_SIZE, BORDER_WIDTH);
    ctx.fillRect(posX, posY, BORDER_WIDTH, FIELD_SIZE);
}

function clickMouse(event) {
    let mouseX = getMouseX(event);
    let mouseY = getMouseY(event);
    
    let clickedChecker = getChecker(mouseX, mouseY);
    if(clickedChecker != null && clickedChecker.color == turn) {
        clickChecker(clickedChecker);
    }

    let clickedMove = getMoveOfChecker(mouseX, mouseY);
    if(clickedMove != null) {
        clickedMove.checker.move(clickedMove.move);
        turn = !turn;
        console.log(clickedMove);
        if(clickedMove.move.toCapture) {
            captureChecker(clickedMove.move.toCapture);
        }
    }
}
function moveMouse(event) {
    let mouseX = getMouseX(event);
    let mouseY = getMouseY(event);

    setCursor(getChecker(mouseX, mouseY) || getMoveOfChecker(mouseX, mouseY) ? CURSOR_POINTER : CURSOR_DEFAULT);
}