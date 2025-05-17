/**
 * Exercice : Mini Pokédex
 * Script principal pour gérer l'affichage des Pokémon, leur tri et leur filtrage
 * @author Steve Fallet
 * @since 2024-09-01
 */

'use strict';

// Couleur par défaut utilisée si un type de Pokémon n'a pas de couleur définie
const DEFAULT_COLOR = '#ccc';

// Dictionnaire associant chaque type de Pokémon à une couleur spécifique
const typeColors = {
    'Électrique': '#FFD700',
    'Plante': '#78C850',
    'Poison': '#A040A0',
    'Feu': '#F08030',
    'Eau': '#6890F0',
    'Normal': '#A8A878',
    'Fée': '#EE99AC',
    'Spectre': '#705898',
    'Combat': '#C03028',
    'Vol': '#A890F0',
    'Glace': '#98D8D8',
    'Roche': '#B8A038',
    'Sol': '#E0C068',
    'Psy': '#F85888'
};

// Liste des Pokémon avec leur nom, type(s), niveau et image associée
const pokemons = [
    { name: 'Pikachu', type: 'Électrique', level: 35, img: 'pikachu.png' },
    { name: 'Bulbizarre', type: 'Plante,Poison', level: 15, img: 'bulbizarre.png' },
    { name: 'Salamèche', type: 'Feu', level: 20, img: 'salameche.png' },
    { name: 'Carapuce', type: 'Eau', level: 10, img: 'carapuce.png' },
    { name: 'Rondoudou', type: 'Normal,Fée', level: 25, img: 'rondoudou.png' },
    { name: 'Ectoplasma', type: 'Spectre,Poison', level: 45, img: 'ectoplasma.png' },
    { name: 'Évoli', type: 'Normal,Combat', level: 22, img: 'evoli.png' },
    { name: 'Dracaufeu', type: 'Feu,Vol', level: 50, img: 'dracaufeu.png' },
    { name: 'Florizarre', type: 'Plante,Poison', level: 55, img: 'florizarre.png' },
    { name: 'Tortank', type: 'Eau', level: 52, img: 'tortank.png' },
    { name: 'Mélofée', type: 'Fée', level: 18, img: 'melofee.png' },
    { name: 'Raichu', type: 'Électrique', level: 40, img: 'raichu.png' },
    { name: 'Magicarpe', type: 'Eau', level: 5, img: 'magicarpe.png' },
    { name: 'Lokhlass', type: 'Eau,Glace', level: 35, img: 'lokhlass.png' },
    { name: 'Onix', type: 'Roche,Sol', level: 30, img: 'onix.png' },
    { name: 'Ronflex', type: 'Normal', level: 45, img: 'ronflex.png' },
    { name: 'Mewtwo', type: 'Psy', level: 70, img: 'mewtwo.png' }
];

// Récupération des éléments HTML pour l'interaction utilisateur
const container = document.querySelector('.pokemon-container'); // Conteneur pour afficher les cartes
const searchBar = document.getElementById('search-bar');        // Barre de recherche
const typeFilter = document.getElementById('type-filter');      // Menu de filtrage par type
const sortOrder = document.getElementById('sort-order');        // Menu de tri

/**
 * Génère le code HTML pour une carte Pokémon
 * @param {Object} pokemon - Un objet contenant les infos d'un Pokémon
 * @returns {string} - Le HTML généré pour la carte
 */
function generatePokemonCardHTML({ name, type, level, img }) {
    const types = type.split(','); // Gère les Pokémon ayant plusieurs types
    let bgColor;

    // Si le Pokémon a deux types, on crée un dégradé entre les deux couleurs
    if (types.length === 2) {
        const color1 = typeColors[types[0].trim()] || DEFAULT_COLOR;
        const color2 = typeColors[types[1].trim()] || DEFAULT_COLOR;
        bgColor = `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`;
    } else {
        // Sinon, on utilise la couleur du type unique
        bgColor = typeColors[types[0].trim()] || DEFAULT_COLOR;
    }

    const imgPath = `images/${img}`; // Chemin vers l'image du Pokémon

    // Retourne le HTML complet de la carte
    return `
        <div class="pokemon-card" style="background: ${bgColor};">
            <img src="${imgPath}" alt="${name}">
            <h2>${name}</h2>
            <div>Type: ${types.join(' / ')}</div>
            <div>Niveau: ${level}</div>
        </div>
    `;
}

/**
 * Affiche les cartes de Pokémon dans le conteneur
 * @param {Array<Object>} pokemons - Liste des Pokémon à afficher
 */
function displayPokemons(pokemons) {
    if (pokemons.length === 0) {
        // Affiche un message humoristique si aucun Pokémon ne correspond
        container.innerHTML = `<p>Dracaufeu a tout brûlé, aucun Pokémon ne correspond à ta recherche !</p>`;
        return;
    }

    let result = ''; // Contiendra le HTML de toutes les cartes

    for (const pokemon of pokemons) {
        // Vérifie que toutes les données nécessaires sont présentes
        if (!pokemon.name || !pokemon.type || !pokemon.level || !pokemon.img) {
            console.error('Pokémon data is incomplete:', pokemon); // Affiche une erreur si données manquantes
            continue;
        }

        // Ajoute le HTML de la carte à la chaîne de résultat
        result += generatePokemonCardHTML(pokemon);
    }

    // Injecte le HTML généré dans le conteneur
    // Meilleure performance que de modifier le DOM à chaque itération
    container.innerHTML = result;
}

/**
 * Applique les filtres et le tri sur les Pokémon, puis les affiche
 */
function filterAndSortPokemons() {
    // Valeurs saisies ou sélectionnées par l'utilisateur
    const searchQuery = searchBar.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedSortOrder = sortOrder.value;

    // Filtrage selon nom et type sélectionné
    let filteredPokemons = pokemons.filter(pokemon => {
        const matchesName = pokemon.name.toLowerCase().includes(searchQuery);
        const matchesType = selectedType === "" || pokemon.type.includes(selectedType);
        return matchesName && matchesType;
    });

    // Tri selon le critère sélectionné
    filteredPokemons.sort((a, b) => {
        if (selectedSortOrder === 'name-asc') {
            return a.name.localeCompare(b.name);  // A-Z
        } else if (selectedSortOrder === 'name-desc') {
            return b.name.localeCompare(a.name);  // Z-A
        } else if (selectedSortOrder === 'level-asc') {
            return a.level - b.level;             // Niveau croissant
        } else if (selectedSortOrder === 'level-desc') {
            return b.level - a.level;             // Niveau décroissant
        }
    });

    // Affiche les résultats filtrés et triés
    displayPokemons(filteredPokemons);
}

// Lien entre les éléments HTML et les fonctions JS (réaction aux actions utilisateur)
searchBar.addEventListener('input', filterAndSortPokemons);  // Recherche en direct
typeFilter.addEventListener('change', filterAndSortPokemons); // Changement de type
sortOrder.addEventListener('change', filterAndSortPokemons);  // Changement d'ordre de tri

// Affiche la liste initiale des Pokémon au chargement (le tri et le filtrage par défaut)
filterAndSortPokemons();
