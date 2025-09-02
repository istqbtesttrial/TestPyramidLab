const cardsData = [
    {
        id: 'add',
        type: 'unit',
        data: {
            titre: "Vérification de l’opération d’addition",
            preconditions: "La calculatrice est ouverte et initialisée",
            entree: "2 + 2",
            etapes: ["Saisir 2", "Appuyer sur +", "Saisir 2", "Appuyer sur ="],
            resultat: "4 s’affiche",
            objectif: "Valider que l’opération d’addition fonctionne correctement"
        }
    },
    {
        id: 'sub',
        type: 'unit',
        data: {
            titre: "Vérification de la fonction de soustraction",
            preconditions: "Calculatrice initialisée",
            entree: "7 - 3",
            etapes: ["Entrer 7", "Appuyer sur -", "Entrer 3", "Appuyer sur ="],
            resultat: "4",
            objectif: "Vérifier la précision de la fonction soustraction"
        }
    },
    {
        id: 'mul',
        type: 'unit',
        data: {
            titre: "Vérification de la multiplication",
            preconditions: "Interface de calcul opérationnelle",
            entree: "3 × 3",
            etapes: ["Cliquer 3", "Cliquer ×", "Cliquer 3", "Cliquer ="],
            resultat: "9",
            objectif: "Tester le module de multiplication"
        }
    },
    {
        id: 'div',
        type: 'unit',
        data: {
            titre: "Vérification de la division",
            preconditions: "Aucun calcul en cours",
            entree: "8 ÷ 2",
            etapes: ["Entrer 8", "Appuyer sur ÷", "Entrer 2", "Appuyer sur ="],
            resultat: "4",
            objectif: "Vérifier le bon fonctionnement de la division"
        }
    },
    {
        id: 'perf1',
        type: 'performance',
        data: {
            titre: "Mesure du temps de réponse d’un service API",
            preconditions: "Serveur en ligne",
            entree: "Requête HTTP GET /api/users",
            etapes: ["Envoyer 500 requêtes simultanées", "Mesurer le temps de réponse moyen"],
            resultat: "Temps < 200ms",
            objectif: "Vérifier la performance sous charge"
        }
    },
    {
        id: 'xss',
        type: 'security',
        data: {
            titre: "Vérification d’une faille XSS dans le champ commentaire",
            preconditions: "L’utilisateur est connecté",
            entree: `<script>alert("xss")</script>`,
            etapes: ["Saisir le script dans un champ commentaire", "Valider le formulaire"],
            resultat: "Le script ne doit pas s’exécuter",
            objectif: "Tester la résistance aux attaques XSS"
        }
    },
    {
        id: 'explore',
        type: 'exploratory',
        data: {
            titre: "Exploration libre de l’interface panier",
            preconditions: "Connexion à un compte utilisateur",
            entree: "Aucune spécifique",
            etapes: ["Ajouter et retirer des produits", "Tester les combinaisons inattendues"],
            resultat: "Aucun plantage",
            objectif: "Identifier des défauts imprévus"
        }
    },
    {
        id: 'perf2',
        type: 'performance',
        data: {
            titre: "Résistance de la base à une forte sollicitation",
            preconditions: "Remplir la base de 100 000 lignes",
            entree: "Requêtes INSERT/SELECT massives",
            etapes: ["Exécuter les requêtes en boucle", "Monitorer les performances"],
            resultat: "Pas de crash ou latence excessive",
            objectif: "Évaluer la robustesse de la base"
        }
    }
];

let draggedCard = null;

// Mélanger les cartes
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderCards() {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '';

    const shuffledCards = shuffleArray([...cardsData]);

    shuffledCards.forEach(card => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.setAttribute('draggable', true);
        div.setAttribute('id', card.id);
        div.setAttribute('data-type', card.type);

        const { titre, preconditions, entree, etapes, resultat, objectif } = card.data;

        div.innerHTML = `
      <div class="card-title">${titre}</div>
      <div class="card-content">
        <strong>Préconditions :</strong> ${preconditions}<br>
        <strong>Entrée :</strong> ${entree}<br>
        <strong>Étapes :</strong>
        <ul>${etapes.map(e => `<li>${e}</li>`).join('')}</ul>
        <strong>Résultat attendu :</strong> ${resultat}<br>
        <strong>Objectif :</strong> ${objectif}
      </div>
    `;

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

function setupDropZones() {
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
            if (draggedCard) {
                zone.classList.remove('hovered');
                zone.appendChild(draggedCard);
            }
        });
    });
}

function setupTooltips() {
    const triggers = document.querySelectorAll('.tooltip-icon[data-tooltip]');
    triggers.forEach(trigger => {
        let tooltip;
        const show = () => {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip-box';
            tooltip.textContent = trigger.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            const rect = trigger.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 4}px`;
        };
        const hide = () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        };
        trigger.addEventListener('mouseenter', show);
        trigger.addEventListener('focus', show);
        trigger.addEventListener('mouseleave', hide);
        trigger.addEventListener('blur', hide);
    });
}

function validateMatches() {
    const zones = document.querySelectorAll('.dropzone');
    let correctMatches = 0;
    let unitTests = [];

    zones.forEach(zone => {
        const expectedType = zone.getAttribute('data-type');
        const cards = zone.querySelectorAll('.card');

        cards.forEach(card => {
            const realType = card.getAttribute('data-type');
            if (realType === expectedType) {
                correctMatches++;
                if (realType === 'unit') {
                    unitTests.push(card.id);
                }
            }
        });
    });

    const feedback = document.getElementById('feedback');
    if (
        unitTests.includes('add') &&
        unitTests.includes('sub') &&
        unitTests.includes('mul') &&
        unitTests.includes('div') &&
        unitTests.length === 4
    ) {
        feedback.innerText = "✅ Bravo ! Vous avez bien identifié les 4 tests unitaires.";
        feedback.style.color = "#2ecc71";
        let continuerBtn = document.getElementById("continuer-btn");
        if (!continuerBtn) {
            continuerBtn = document.createElement("button");
            continuerBtn.innerText = "Continuer";
            continuerBtn.id = "continuer-btn";
            continuerBtn.classList.add("continue-btn");
            continuerBtn.onclick = showIntegrationSection;
            document.querySelector(".button-container").appendChild(continuerBtn);
        }
    } else {
        feedback.innerText = "❌ Tous les tests ne sont pas correctement classés. Réessayez.";
        feedback.style.color = "#e74c3c";
    }
}

renderCards();
setupDropZones();
setupTooltips();
// Fonction d’affichage de la section 2
function showIntegrationSection() {
    const section = document.getElementById("integration-section");
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
    setupIntegrationDropzones();
}

// Initialisation du drag-and-drop pour la section 2
function setupIntegrationDropzones() {
    const dropAreas = document.querySelectorAll(".drop-area");

    dropAreas.forEach(area => {
        area.addEventListener("dragover", e => {
            e.preventDefault();
            area.classList.add("hovered");
        });

        area.addEventListener("dragleave", () => {
            area.classList.remove("hovered");
        });

        area.addEventListener("drop", () => {
            area.classList.remove("hovered");
            if (draggedCard && !area.querySelector(".card")) {
                area.appendChild(draggedCard);
            }
        });
    });
}

// Validation des bonnes combinaisons (Section 2)
function validateIntegration() {
    const scenarioA1 = document.querySelector('[data-slot="1a"] .card');
    const scenarioA2 = document.querySelector('[data-slot="1b"] .card');
    const scenarioB1 = document.querySelector('[data-slot="2a"] .card');
    const scenarioB2 = document.querySelector('[data-slot="2b"] .card');

    const idsA = [scenarioA1?.id, scenarioA2?.id].sort().join("-");
    const idsB = [scenarioB1?.id, scenarioB2?.id].sort().join("-");

    const expectedA = ["add", "mul"].sort().join("-");
    const expectedB = ["sub", "div"].sort().join("-");

    const feedback = document.getElementById("integration-feedback");

    if (idsA === expectedA && idsB === expectedB) {
        feedback.innerText = "✅ Bravo ! Vous avez combiné correctement les cas de test.";
        feedback.style.color = "#27ae60";
        document.getElementById("question-type-section").style.display = "block";
    } else {
        feedback.innerText = "❌ Les combinaisons ne sont pas correctes. Réessayez.";
        feedback.style.color = "#c0392b";
    }
}
function submitTypeAnswer() {
    const checkboxes = document.querySelectorAll('#type-form input[type="checkbox"]');
    const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const feedback = document.getElementById('type-feedback');

    if (selected.length === 0) {
        feedback.innerText = "❗ Veuillez sélectionner au moins un type.";
        feedback.style.color = "#f39c12";
        return;
    }

    if (selected.includes("integration") && selected.length === 1) {
        feedback.innerText = "✅ Exact ! Il s'agit bien d'un test d’intégration.";
        feedback.style.color = "#27ae60";
    } else {
        feedback.innerText = "❌ Ce n’est pas tout à fait ça. Essayez de réfléchir à l’objectif de ces combinaisons.";
        feedback.style.color = "#c0392b";
    }
}
