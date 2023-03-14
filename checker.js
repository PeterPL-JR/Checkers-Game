const DIR_TOP = -1;
const DIR_BOTTOM = 1;

const PLAYER_CHECKERS_FOR_X = FIELDS_IN_ROW / 2;
const PLAYER_CHECKERS_FOR_Y = 3;

const CHECKERS_FOR_PLAYER = PLAYER_CHECKERS_FOR_X * PLAYER_CHECKERS_FOR_Y;
const checkers = [];

function initCheckers() {
    for(let x = 0; x < PLAYER_CHECKERS_FOR_X; x++) {
        for(let y = 0; y < PLAYER_CHECKERS_FOR_Y; y++) {

            let typeLightX = 2 * x + (y % 2);
            let typeDarkX = 2 * x + !(y % 2);

            let typeLightY = y;
            let typeDarkY = FIELDS_IN_ROW - 1 - y;

            checkers.push(new Checker(typeLightX, typeLightY, TYPE_LIGHT, DIR_TOP));
            checkers.push(new Checker(typeDarkX, typeDarkY, TYPE_DARK, DIR_BOTTOM));
        }
    }
}

function renderCheckers() {
    for(let checker of checkers) {
        checker.render();
    }
}

const CHECKER_LIGHT_COLOR = "#e7d09e";
const CHECKER_DARK_COLOR = "#272727";

const CHECKER_BORDER_WIDTH = 7;
const CHECKER_INNER_BORDER_WIDTH = 4;

const CHECKER_BORDER_LIGHT_COLOR = "#b6a175";
const CHECKER_BORDER_DARK_COLOR = "#000000";

const CLICKED_CHECKER_BORDER_COLOR = "#cb9b00";
const CLICKED_CHECKER_BORDER_WIDTH = CHECKER_BORDER_WIDTH * 0.7;

const DEFAULT_OPACITY = "ff";
const MOVE_OPACITY = "55";

class Checker {
    static CIRCLE_RADIUS = FIELD_SIZE * 0.70 / 2;

    constructor(beginX, beginY, colorType, direction) {
        this.x = beginX;
        this.y = beginY;
        this.color = colorType;
        this.direction = direction;
        this.clicked = false;
        this.moves = [];
    }
    render() {
        renderChecker(this.x, this.y, this.color);

        if(this.clicked) {
            this.renderCircleClicked();

            for(let move of this.moves) {
                this.renderMove(move.x, move.y);
            }
        }
    }
    renderMove(x, y) {
        renderChecker(x, y, this.color, MOVE_OPACITY);
    }

    click(clicked) {
        const possibleMoves = this.getMoves();
        if(possibleMoves.length == 0) {
            this.clicked = false;
            return;
        }

        this.clicked = clicked;
        this.moves = (this.clicked) ? possibleMoves : [];
    }
    move(move) {
        this.x = move.x;
        this.y = move.y;

        this.click(false);
    }
    getMoves() {
        let moves = [];

        let move1X = this.x - 1;
        let move2X = this.x + 1;

        let movesY = this.y - this.direction;
        this.tryGetMove(move1X, movesY, moves, -1);
        this.tryGetMove(move2X, movesY, moves, 1);

        return moves;
    }
    tryGetMove(x, y, movesArray, horizontalDirection) {
        // Check if the move is out of bounds
        if(x < 0 || x >= FIELDS_IN_ROW || y < 0 || y >= FIELDS_IN_ROW) return;

        // Check if a field of the move is taken by a checker
        let otherChecker = checkers.find(function(checker) {
            return checker.x == x && checker.y == y;
        });

        let position = getPos(x, y);
        if(otherChecker) {
            if(otherChecker.color != this.color) {
                let nextMoveX = position.x + horizontalDirection;
                let nextMoveY = position.y - this.direction;
                
                let capturingPosition = getPos(nextMoveX, nextMoveY);
                if(!isFieldTaken(nextMoveX, nextMoveY)) {
                    capturingPosition = Object.assign(capturingPosition, {toCapture: otherChecker});
                    movesArray.push(capturingPosition);
                }
            }
            return;
        }
        movesArray.push(position);
    }
    renderCircleClicked() {
        let borderY = getPositionOnCanvas(this.x) + FIELD_SIZE / 2;
        let borderX = getPositionOnCanvas(this.y) + FIELD_SIZE / 2;
        let borderRadius = Checker.CIRCLE_RADIUS + CLICKED_CHECKER_BORDER_WIDTH;
        
        drawCircle(borderY, borderX, borderRadius, CLICKED_CHECKER_BORDER_COLOR, CLICKED_CHECKER_BORDER_WIDTH);
    }
}

function renderChecker(x, y, color, opacity=DEFAULT_OPACITY) {
    let absRadius = Checker.CIRCLE_RADIUS;
    let innerRadius = absRadius * 0.7;

    let posX = getPositionOnCanvas(x) + FIELD_SIZE / 2;
    let posY = getPositionOnCanvas(y) + FIELD_SIZE / 2;

    let borderColor = (color == TYPE_LIGHT ? CHECKER_BORDER_LIGHT_COLOR : CHECKER_BORDER_DARK_COLOR) + opacity;
    let circleColor = (color == TYPE_LIGHT ? CHECKER_LIGHT_COLOR : CHECKER_DARK_COLOR) + opacity;

    renderCircle(posX, posY, absRadius, circleColor);
    
    drawCircle(posX, posY, absRadius, borderColor, CHECKER_BORDER_WIDTH);
    drawCircle(posX, posY, innerRadius, borderColor, CHECKER_INNER_BORDER_WIDTH);
}

function clickChecker(checker) {
    if(checker.clicked) {
        checker.click(false);
        return;
    }

    for(let otherChecker of checkers) {
        otherChecker.click(false);
    }
    checker.click(true);
}
function removeChecker(checker) {
    checkers.splice(checkers.indexOf(checker), 1);
}

function captureChecker(checker) {
    removeChecker(checker);
    points[checker.color == TYPE_LIGHT ? TYPE_DARK : TYPE_LIGHT]++;
}