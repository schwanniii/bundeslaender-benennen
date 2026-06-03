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
let loesungAngezeigt = false;
let svgDocument = null;

function getPathId(state) {
    return pathIdMap[state] || state;
}

function initGame() {
    const karteObject = document.getElementById('karteObject');
    karteObject.addEventListener('load', () => {
        svgDocument = karteObject.contentDocument;
        if (!svgDocument) return;

        const styleElement = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElement.textContent = `
            .bundesland-region {
                fill: transparent !important;
                stroke: #afc9ff !important;
                stroke-width: 1.5 !important;
                cursor: pointer;
                transition: all 0.2s ease;
                vector-effect: non-scaling-stroke;
                touch-action: manipulation;
                pointer-events: all !important;
            }

            .bundesland-region:hover,
            .bundesland-region.pointer-down {
                fill: rgba(37, 99, 235, 0.18) !important;
            }

            .touch-hit-area,
            .touch-hit-area:hover,
            .touch-hit-area.pointer-down,
            .touch-hit-area.active,
            .touch-hit-area.wrong,
            .touch-hit-area.solution {
                fill: transparent !important;
                stroke: none !important;
                outline: none !important;
                background: none !important;
                cursor: pointer;
                transition: all 0.2s ease;
                vector-effect: non-scaling-stroke;
                touch-action: manipulation;
                pointer-events: all !important;
            }

            .bundesland-region.active {
                fill: rgba(16, 185, 129, 0.35) !important;
                stroke: rgba(16, 185, 129, 0.9) !important;
                stroke-width: 2.5 !important;
            }

            .bundesland-region.wrong {
                fill: rgba(239, 68, 68, 0.35) !important;
                stroke: rgba(239, 68, 68, 0.9) !important;
                stroke-width: 2.5 !important;
            }

            .bundesland-region.solution {
                fill: rgba(245, 158, 11, 0.25) !important;
                stroke: rgba(245, 158, 11, 0.9) !important;
                stroke-width: 2.5 !important;
            }`;
        svgDocument.documentElement.appendChild(styleElement);

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

        touchArea.classList.add('touch-hit-area');
        touchArea.dataset.bundesland = state;
        touchArea.style.pointerEvents = 'all';

        touchArea.setAttribute('fill', 'transparent');
        touchArea.setAttribute('stroke', 'none');

        touchArea.addEventListener('click', () => {
            AnswerGiven(state);
        });
        touchArea.addEventListener('pointerenter', () => {
            path.classList.add('pointer-down');
        });
        touchArea.addEventListener('pointerdown', () => {
            path.classList.add('pointer-down');
        });
        touchArea.addEventListener('pointerleave', () => {
            path.classList.remove('pointer-down');
        });
        touchArea.addEventListener('pointerup', () => {
            path.classList.remove('pointer-down');
        });

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
    if (loesungAngezeigt === true) {
        resetButtonColors();
    }

    zufälligesBundesland = alleBundesländer[Math.floor(Math.random() * alleBundesländer.length)];
    document.getElementById('frage').innerText = zufälligesBundesland;

    if (loesungAngezeigt === true) {
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

function MapOrder(polygon) {
    if (!svgDocument) return;
    svgDocument.documentElement.appendChild(polygon);

    svgDocument.querySelectorAll('.touch-hit-area').forEach(circle => {
        svgDocument.documentElement.appendChild(circle);
    });

    const aussengrenze = svgDocument.getElementById('path3789');
    if (aussengrenze) {
        svgDocument.documentElement.appendChild(aussengrenze);
    }
}

function showCorrect() {
    const polygon = getStatePath(zufälligesBundesland);
    if (!polygon) return;

    MapOrder(polygon);

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

    MapOrder(polygon);

    polygon.classList.add('wrong');
    document.body.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2c26 100%)';

    console.log(polygon);

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

    MapOrder(polygon);

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

function toggleSolution() {
    if (loesungAngezeigt === true) {
        resetButtonColors();
        loesungAngezeigt = false;
    } else {
        highlightSolution();
        loesungAngezeigt = true;
    }
}


document.getElementById('btn_hilfeUmschalten').addEventListener('click', toggleHelp);
document.getElementById('btn_loesungAnzeigenUmschalten').addEventListener('click', toggleSolution);

document.addEventListener('DOMContentLoaded', initGame);