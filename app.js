// Slope of a Segment - Vanilla JS Frontend
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const questionDiv = document.getElementById('question');
const feedbackDiv = document.getElementById('feedback');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const WIDTH = 400;
const HEIGHT = 400;
const PADDING = 40;
const AXIS_COLOR = '#333';
const LINE_COLOR = '#007bff';
const POINT_COLOR = '#ff4136';

let line = null;
let point = null;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLine() {
    // y = mx + b, m in [-2,2] (not 0), b in [-5,5]
    let m = 0;
    while (m === 0) m = getRandomInt(-2, 2);
    let b = getRandomInt(-5, 5);
    return { m, b };
}

function randomPoint() {
    // x in [-8,8], y in [-8,8]
    return {
        x: getRandomInt(-8, 8),
        y: getRandomInt(-8, 8)
    };
}

function isPointOnLine(pt, line) {
    // y = mx + b
    return pt.y === line.m * pt.x + line.b;
}

function drawGraph(line) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw axes
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    // x axis
    ctx.moveTo(PADDING, HEIGHT/2);
    ctx.lineTo(WIDTH-PADDING, HEIGHT/2);
    // y axis
    ctx.moveTo(WIDTH/2, PADDING);
    ctx.lineTo(WIDTH/2, HEIGHT-PADDING);
    ctx.stroke();

    // Draw ticks (no number labels)
    ctx.font = '12px Arial';
    ctx.fillStyle = AXIS_COLOR;
    for (let i = -8; i <= 8; i++) {
        // x ticks
        let x = mapX(i);
        ctx.beginPath();
        ctx.moveTo(x, HEIGHT/2-5);
        ctx.lineTo(x, HEIGHT/2+5);
        ctx.stroke();
        // y ticks
        let y = mapY(i);
        ctx.beginPath();
        ctx.moveTo(WIDTH/2-5, y);
        ctx.lineTo(WIDTH/2+5, y);
        ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Find two points on the line within x range
    let x1 = -8, x2 = 8;
    let y1 = line.m * x1 + line.b;
    let y2 = line.m * x2 + line.b;
    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();
}

function mapX(x) {
    // x in [-8,8] to [PADDING, WIDTH-PADDING]
    return PADDING + ((x + 8) / 16) * (WIDTH - 2*PADDING);
}
function mapY(y) {
    // y in [-8,8] to [HEIGHT-PADDING, PADDING] (invert)
    return HEIGHT - PADDING - ((y + 8) / 16) * (HEIGHT - 2*PADDING);
}

function newRound() {
    feedbackDiv.textContent = '';
    line = randomLine();
    drawGraph(line);
    // Generate a point, 50% chance to be on the line
    let onLine = Math.random() < 0.5;
    let pt;
    if (onLine) {
        // Pick random x, compute y
        let x = getRandomInt(-8, 8);
        let y = line.m * x + line.b;
        pt = { x, y };
    } else {
        // Pick random point, ensure not on line
        do {
            pt = randomPoint();
        } while (isPointOnLine(pt, line));
    }
    point = pt;
    questionDiv.textContent = `Is the point (${point.x}, ${point.y}) on the line y = ${line.m}x + ${line.b}?`;
}

yesBtn.onclick = function() {
    checkAnswer(true);
};
noBtn.onclick = function() {
    checkAnswer(false);
};

function checkAnswer(userSaysYes) {
    const correct = isPointOnLine(point, line);
    if ((userSaysYes && correct) || (!userSaysYes && !correct)) {
        feedbackDiv.textContent = 'Correct!';
        feedbackDiv.style.color = '#007b00';
    } else {
        feedbackDiv.textContent = 'Incorrect.';
        feedbackDiv.style.color = '#d90429';
    }
    // Plot the point on the graph after answering
    ctx.beginPath();
    ctx.arc(mapX(point.x), mapY(point.y), 7, 0, 2 * Math.PI);
    ctx.fillStyle = POINT_COLOR;
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
    setTimeout(newRound, 1200);
}

// Start first round
newRound();
