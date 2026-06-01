const alleBundesländer = [
    "Schleswig-Holstein",
    "Mecklenburg-Vorpommern",
    "Hamburg",
    "Niedersachsen",
    "Bremen",
    "Thüringen",
    "Sachsen",
    "Sachsen-Anhalt",
    "Brandenburg",
    "Berlin",
    "Nordrhein-Westfalen",
    "Hessen",
    "Rheinland-Pfalz",
    "Saarland",
    "Baden-Württemberg",
    "Bayern"
];

const pathIdMap = {
    "Baden-Württemberg": "Baden__x26__Württemberg"
};

let zufälligesBundesland;
let hilfenAngezeigt = false;
let lösungAngezeigt = false;
let svgDocument = null;

function getPathId(state) {
    return pathIdMap[state] || state;
}

function initGame() {
    const karteObject = document.getElementById('karteObject');
    karteObject.addEventListener('load', () => {
        svgDocument = karteObject.contentDocument;
        if (!svgDocument) return;

        prepareMapPaths();
        attachMapListeners();
        neueRunde();
    });
}

const smallTouchStates = ["Bremen", "Hamburg", "Berlin"];

function prepareMapPaths() {
    alleBundesländer.forEach(state => {
        const path = svgDocument.getElementById(getPathId(state));
        if (!path) return;

        path.classList.add('bundesland-region');
        path.dataset.bundesland = state;
    });

    createTouchExpansions();
}

function createTouchExpansions() {
    smallTouchStates.forEach(state => {
        const path = svgDocument.getElementById(getPathId(state));
        if (!path) return;

        const bbox = path.getBBox();
        const radius = Math.max(18, Math.min(36, Math.max(bbox.width, bbox.height) * 1.2));
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const touchArea = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'circle');
        touchArea.setAttribute('cx', cx);
        touchArea.setAttribute('cy', cy);
        touchArea.setAttribute('r', radius);
        touchArea.classList.add('bundesland-region', 'touch-hit-area');
        touchArea.dataset.bundesland = state;
        touchArea.style.pointerEvents = 'all';

        touchArea.setAttribute('fill', 'transparent');
        touchArea.setAttribute('stroke', 'none');

        svgDocument.documentElement.appendChild(touchArea);
    });
}

function attachMapListeners() {
    svgDocument.querySelectorAll('.bundesland-region').forEach(path => {
        path.addEventListener('click', () => {
            AnswerGiven(path.dataset.bundesland);
        });

        path.addEventListener('pointerdown', () => {
            if (!hilfenAngezeigt) {
                path.classList.add('pointer-down');
            }
        });

        path.addEventListener('pointerup', () => {
            path.classList.remove('pointer-down');
        });

        path.addEventListener('pointerleave', () => {
            path.classList.remove('pointer-down');
        });
    });
}

function neueRunde() {
    if (lösungAngezeigt === true) {
        resetButtonColors();
    }

    zufälligesBundesland = alleBundesländer[Math.floor(Math.random() * alleBundesländer.length)];
    document.getElementById('frage').innerText = zufälligesBundesland;

    if (lösungAngezeigt === true) {
        highlightSolution();
    }
}

function AnswerGiven(Answer) {
    if (Answer === zufälligesBundesland) {
        showCorrect();
        neueRunde();
    } else {
        showIncorrect();
    }
}

function showCorrect() {
    const polygon = getStatePath(zufälligesBundesland);
    if (!polygon) return;

    polygon.classList.add('active');
    document.body.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

    setTimeout(() => {
        polygon.classList.remove('active');
        document.body.style.background = 'linear-gradient(135deg, var(--bg-light) 0%, var(--bg-dark) 100%)';
    }, 700);
}

function showIncorrect() {
    const polygon = getStatePath(zufälligesBundesland);
    if (!polygon) return;

    polygon.classList.add('wrong');
    document.body.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

    setTimeout(() => {
        polygon.classList.remove('wrong');
        document.body.style.background = 'linear-gradient(135deg, var(--bg-light) 0%, var(--bg-dark) 100%)';
    }, 500);
}

function resetButtonColors() {
    if (!svgDocument) return;
    svgDocument.querySelectorAll('.bundesland-region').forEach(polygon => {
        polygon.classList.remove('active', 'wrong', 'solution');
    });
}

function highlightSolution() {
    const polygon = getStatePath(zufälligesBundesland);
    if (polygon) {
        polygon.classList.add('solution');
    }
}

function getStatePath(state) {
    if (!svgDocument) return null;
    return svgDocument.getElementById(getPathId(state));
}

function toggleHelp() {
    if (!svgDocument) return;

    if (hilfenAngezeigt === true) {
        svgDocument.querySelectorAll('[data-hilfe-text]').forEach(text => text.remove());
        hilfenAngezeigt = false;
        return;
    }

    svgDocument.querySelectorAll('.bundesland-region').forEach(path => {
        const state = path.dataset.bundesland;
        const bbox = path.getBBox();
        const x = bbox.x + bbox.width / 2;
        const y = bbox.y + bbox.height / 2;

        const text = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#1e293b');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('pointer-events', 'none');
        text.setAttribute('data-hilfe-text', 'true');
        text.textContent = state;

        svgDocument.documentElement.appendChild(text);
    });

    hilfenAngezeigt = true;
}

document.getElementById('btn_hilfeUmschalten').addEventListener('click', toggleHelp);
document.getElementById('btn_lösungAnzeigenUmschalten').addEventListener('click', function() {
    if (lösungAngezeigt === true) {
        resetButtonColors();
        lösungAngezeigt = false;
    } else {
        highlightSolution();
        lösungAngezeigt = true;
    }
});

document.addEventListener('DOMContentLoaded', initGame);