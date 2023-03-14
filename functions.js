function getChecker(mouseX, mouseY) {
    let checker = checkers.find(function(checker) {
        return containInField(mouseX, mouseY, checker.x, checker.y);
    });
    return checker ? checker : null;
}
function getMoveOfChecker(mouseX, mouseY) {
    for(let checker of checkers) {
        if(!checker.clicked || checker.moves.length == 0) continue;

        let move = checker.moves.find(function(move) {
            return containInField(mouseX, mouseY, move.x, move.y);
        });
        if(move != null) {
            return {checker, move};
        }
    }
    return null;
}

function isFieldTaken(fieldX, fieldY) {
    const checker = checkers.find(function(checker) {
        return checker.x == fieldX && checker.y == fieldY;
    });
    return checker ? checker : null;
}

function renderCircle(centerX, centerY, radius, fillColor) {
    ctx.fillStyle = fillColor;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
function drawCircle(centerX, centerY, radius, strokeColor, lineWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}
function drawCrown(x, y, width, height, lineColor, lineWidth) {
    const OFFSET_X = x - width / 2;
    const OFFSET_Y = y - height / 2;

    const OFFSET = width / 3;
    const BASE_OFFSET = width * 0.2;
    const TOPS_OFFSET = height * 0.3;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctx.translate(OFFSET_X, OFFSET_Y);
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(OFFSET, TOPS_OFFSET);
    ctx.lineTo(width / 2, 0);
    ctx.lineTo(OFFSET * 2, TOPS_OFFSET);
    ctx.lineTo(width, 0);
    
    ctx.lineTo(width - BASE_OFFSET, height);
    ctx.lineTo(BASE_OFFSET, height);
    ctx.lineTo(0, 0);

    ctx.closePath();
    ctx.stroke();

    ctx.translate(-OFFSET_X, -OFFSET_Y);
}

function getPos(x, y) {
    return {x, y};
}
function contain(pointX, pointY, x, y, width, height) {
    return pointX >= x && pointX < x + width && pointY >= y && pointY < y + height;
}
function containInField(pointX, pointY, fieldX, fieldY) {
    return contain(pointX, pointY, getPositionOnCanvas(fieldX), getPositionOnCanvas(fieldY), FIELD_SIZE, FIELD_SIZE);
}

function getPositionOnCanvas(pos) {
    return pos * FIELD_SIZE;
}

function getMouseX(event) {
    return event.clientX - canvas.offsetLeft;
}
function getMouseY(event) {
    return event.clientY - canvas.offsetTop;
}

const CURSOR_DEFAULT = "var(--cursor-default)";
const CURSOR_POINTER = "var(--cursor-pointer)";

function setCursor(cursor) {
    canvas.style.cursor = cursor;
}

function getType(object) {
    return object.constructor.name;
}

function checkCoordinates(x, y) {
    return !(x < 0 || x >= FIELDS_IN_ROW || y < 0 || y >= FIELDS_IN_ROW);
}