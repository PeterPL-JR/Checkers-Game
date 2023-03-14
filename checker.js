const DIR_TOP = -1;
const DIR_BOTTOM = 1;

const PLAYER_CHECKERS_FOR_X = FIELDS_IN_ROW / 2;
const PLAYER_CHECKERS_FOR_Y = 3;

const CHECKERS_FOR_PLAYER = PLAYER_CHECKERS_FOR_X * PLAYER_CHECKERS_FOR_Y;
const checkers = [];

let capturingChecker = null;

// Initialize checkers objects
function initCheckers() {
    for(let x = 0; x < PLAYER_CHECKERS_FOR_X; x++) {
        for(let y = 0; y < PLAYER_CHECKERS_FOR_Y; y++) {

            let typeLightX = 2 * x + (y % 2);
            let typeDarkX = 2 * x + !(y % 2);

            let typeLightY = y;
            let typeDarkY = FIELDS_IN_ROW - 1 - y;

            checkers.push(new Checker(typeLightX, typeLightY, TYPE_LIGHT));
            checkers.push(new Checker(typeDarkX, typeDarkY, TYPE_DARK));
        }
    }
}
// Render all the checkers from the array
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

// Checker class
class Checker {
    static CIRCLE_RADIUS = FIELD_SIZE * 0.70 / 2;

    constructor(beginX, beginY, colorType) {
        this.x = beginX;
        this.y = beginY;
        this.color = colorType;
        this.direction = (colorType == TYPE_LIGHT) ? DIR_TOP : DIR_BOTTOM;

        this.clicked = false;
        this.capturingMode = false;
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
        if(!this.capturingMode) {
            this.moves = (this.clicked) ? possibleMoves : [];
        }
    }
    move(move) {
        this.x = move.x;
        this.y = move.y;

        this.click(false);

        let kingY = this.color == TYPE_LIGHT ? FIELDS_IN_ROW - 1 : 0;
        if(this.y == kingY) {
            KingChecker.createKing(this);
        }
    }
    getMoves() {
        let moves = [];
        Checker.getCapturingMoves(this, moves);
        return moves;
    }

    tryGetMove(movesArray, horizontal) {
        let x = this.x + horizontal;
        let y = this.y - this.direction;
        
        // Check if the move is out of bounds
        if(!checkCoordinates(x, y)) return;
        
        let result = this.checkCapturing(this.x, this.y, horizontal, -this.direction);
        if(result != null) movesArray.push(result);
        else return;
    }
    
    checkCapturing(x, y, horizontal, vertical) {
        let posX = x + horizontal;
        let posY = y + vertical;
        let position = getPos(posX, posY);
        
        // Check if a field of the move is taken by a checker
        let otherChecker = checkers.find(function(checker) {
            return checker.x == posX && checker.y == posY;
        });

        if(otherChecker) {
            if(otherChecker.color != this.color) {
                let nextMoveX = position.x + horizontal;
                let nextMoveY = position.y + vertical;
                if(!checkCoordinates(nextMoveX, nextMoveY)) return;
                
                let capturingPosition = getPos(nextMoveX, nextMoveY);
                if(!isFieldTaken(nextMoveX, nextMoveY)) {
                    capturingPosition = Object.assign(capturingPosition, {toCapture: otherChecker});
                    return capturingPosition;
                }
            }
            return null;
        }
        return position;
    }

    renderCircleClicked() {
        let borderY = getPositionOnCanvas(this.x) + FIELD_SIZE / 2;
        let borderX = getPositionOnCanvas(this.y) + FIELD_SIZE / 2;
        let borderRadius = Checker.CIRCLE_RADIUS + CLICKED_CHECKER_BORDER_WIDTH;
        
        drawCircle(borderY, borderX, borderRadius, CLICKED_CHECKER_BORDER_COLOR, CLICKED_CHECKER_BORDER_WIDTH);
    }

    setCapturingMode(movesArray) {
        capturingChecker.capturingMode = true;
        capturingChecker.moves = movesArray;
    }
    resetCapturingMode() {
        capturingChecker.capturingMode = false;
    }

    static getCapturingMoves(checker, array) {
        checker.tryGetMove(array, -1);
        checker.tryGetMove(array, 1);
    }
}

// King-Checker Subclass
class KingChecker extends Checker {
    constructor(checker) {
        super(checker.x, checker.y, checker.color);
    }

    render() {
        super.render();
        renderKingCrown(this.x, this.y, this.color);
    }
    renderMove(x, y) {
        super.renderMove(x, y);
        renderKingCrown(x, y, this.color, MOVE_OPACITY);
    }

    getMoves() {
        let moves = [];
        KingChecker.getCapturingMoves(this, moves);
        return moves;
    }

    tryGetMove(movesArray, horizontal, vertical) {
        let checkerX = this.x + horizontal;
        let checkerY = this.y + vertical;

        for(let x = 0; x < FIELDS_IN_ROW - 1; x++) {            
            let posX = checkerX + horizontal * x;
            if(posX < 0 || posX >= FIELDS_IN_ROW) continue;
            
            for(let y = 0; y < FIELDS_IN_ROW - 1; y++) {
                let posY = checkerY + vertical * y;
                if(posY < 0 || posY >= FIELDS_IN_ROW) continue;

                if(x == y) {
                    let position = getPos(posX, posY);
                    let result = this.checkCapturing(posX - horizontal, posY - vertical, horizontal, vertical);
                    if(result == null) return;
                    
                    if(result.toCapture) {
                        movesArray.push(result);
                        return;
                    }
                    movesArray.push(position);
                }
            }
        }
    }

    static createKing(checker) {
        checkers.push(new KingChecker(checker));
        removeChecker(checker);
    }
    static getCapturingMoves(checker, array) {
        checker.tryGetMove(array, 1, 1);
        checker.tryGetMove(array, 1, -1);
        checker.tryGetMove(array, -1, 1);
        checker.tryGetMove(array, -1, -1);
    }
}

// Render a checker
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

const CROWN_WIDTH = Checker.CIRCLE_RADIUS;
const CROWN_HEIGHT = CROWN_WIDTH * 0.6;

const CROWN_LINE_WIDTH = 3;

// Render crown of king checker
function renderKingCrown(x, y, color, opacity=DEFAULT_OPACITY) {
    let posX = getPositionOnCanvas(x) + FIELD_SIZE / 2;
    let posY = getPositionOnCanvas(y) + FIELD_SIZE / 2;

    let lineColor = (color == TYPE_LIGHT ? CHECKER_BORDER_LIGHT_COLOR : CHECKER_BORDER_DARK_COLOR) + opacity;
    drawCrown(posX, posY, CROWN_WIDTH, CROWN_HEIGHT, lineColor, CROWN_LINE_WIDTH);
}

// Select a checker
function clickChecker(checker) {
    // If the capturing checker is defined, returns
    if(capturingChecker != null) {
        // If this checker is the capturing checker, select it
        if(checker == capturingChecker) {
            checker.click(true);
        }
        return;
    }

    // If this checker is already clicked, unselect it
    if(checker.clicked) {
        checker.click(false);
        return;
    }

    // Unselect all another checkers
    for(let otherChecker of checkers) {
        otherChecker.click(false);
    }
    // Select this checker
    checker.click(true);
}
// Capture a checker
function captureChecker(checker) {
    removeChecker(checker);
    points[checker.color == TYPE_LIGHT ? TYPE_DARK : TYPE_LIGHT]++;
    countPlayersCheckers();
}
// Remove a checker
function removeChecker(checker) {
    checkers.splice(checkers.indexOf(checker), 1);
}

// Select a field to move a checker
function clickMove(move) {
    let checker = move.checker;
    if(capturingChecker != null) {
        resetCapturingMode();
    }

    // Move the checker to the selected field
    checker.move(move.move);
    // Capture the opponent checker
    if(move.move.toCapture) {
        captureChecker(move.move.toCapture);
        if(tryCapturingMode(checker)) return;
    }
    turn = !turn;
}

// Check if a checker could capture more opponents
function tryCapturingMode(clickedChecker) {
    let movesArrayBuffer = [];
    
    // Try to get capturing moves
    if(getType(clickedChecker) == "Checker") Checker.getCapturingMoves(clickedChecker, movesArrayBuffer);
    if(getType(clickedChecker) == "KingChecker") KingChecker.getCapturingMoves(clickedChecker, movesArrayBuffer);

    let movesArray = [];
    for(let moveBuffer of movesArrayBuffer) {
        if(moveBuffer.toCapture) movesArray.push(moveBuffer);
    }

    // Show a next capturing move if there're any possible moves
    if(movesArray.length != 0) {
        setCapturingMode(clickedChecker, movesArray)
        return true;
    }
    return false;
}

// Set multi-capturing mode
function setCapturingMode(checker, movesArray) {
    capturingChecker = checker;
    capturingChecker.setCapturingMode(movesArray);
    
    clickChecker(capturingChecker);
}
// Reset multi-capturing mode
function resetCapturingMode() {
    capturingChecker.resetCapturingMode();
    capturingChecker = null;
}