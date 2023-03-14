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