const cardsData = [
    {
        id: 'unit-test',
        quadrant: 'q1',
        text: 'Test unitaire sur une fonction critique'
    },
    {
        id: 'api-test',
        quadrant: 'q2',
        text: 'Test fonctionnel automatisé d\'API'
    },
    {
        id: 'exploratory-ui',
        quadrant: 'q3',
        text: 'Session de test exploratoire sur l\'interface'
    },
    {
        id: 'load-test',
        quadrant: 'q4',
        text: 'Test de charge sur le serveur'
    }
];

let draggedCard = null;

function renderCards() {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '';

    cardsData.forEach(card => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.setAttribute('draggable', true);
        div.setAttribute('id', card.id);
        div.setAttribute('data-quadrant', card.quadrant);
        div.textContent = card.text;

        div.addEventListener('dragstart', () => {
            draggedCard = div;
            div.classList.add('dragged');
        });

        div.addEventListener('dragend', () => {
            draggedCard = null;
            div.classList.remove('dragged');
        });

        container.appendChild(div);
    });
}

function setupDropzones() {
    const zones = document.querySelectorAll('.dropzone');

    zones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('hovered');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', () => {
            zone.classList.remove('hovered');
            if (draggedCard) {
                zone.appendChild(draggedCard);
            }
        });
    });
}

function validateMatches() {
    const zones = document.querySelectorAll('.dropzone');
    let correct = 0;

    zones.forEach(zone => {
        const expected = zone.getAttribute('data-quadrant');
        const card = zone.querySelector('.card');
        if (card && card.getAttribute('data-quadrant') === expected) {
            correct++;
        }
    });

    const feedback = document.getElementById('feedback');
    if (correct === cardsData.length) {
        feedback.innerText = '✅ Bravo ! Tous les cas sont correctement classés.';
        feedback.style.color = '#2ecc71';
    } else {
        feedback.innerText = '❌ Certains cas ne sont pas au bon endroit.';
        feedback.style.color = '#e74c3c';
    }
}

renderCards();
setupDropzones();
