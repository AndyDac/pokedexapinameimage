const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemonIndex = 1;

function displayPokemon() {
    const url = `${baseUrl}${currentPokemonIndex}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const name = data.name;
            const number = data.id;
            const type = data.types[0].type.name;
            const image = data.sprites.front_default;

            document.getElementById('pokemon-name').innerText = name;
            document.getElementById('pokemon-number').innerText = `#${number}`;
            document.getElementById('pokemon-type').innerText = `Type: ${type}`;
            document.getElementById('pokemon-image').src = image;
        })
        .catch(error => console.error('Error fetching Pokemon:', error));
}

function changePokemon(direction) {
    if (direction === 'next') {
        currentPokemonIndex++;
    } else if (direction === 'previous') {
        currentPokemonIndex = Math.max(1, currentPokemonIndex - 1);
    }

    displayPokemon();
}

function searchPokemon() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    fetch(`${baseUrl}${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            currentPokemonIndex = data.id;
            displayPokemon();
        })
        .catch(error => {
            // Caso a pesquisa não encontre, exibir o Pokémon mais próximo
            console.error('Error searching Pokemon:', error);
            searchClosestPokemon(searchTerm);
        });
}

function searchClosestPokemon(searchTerm) {
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonList = data.results;
            const closestPokemon = pokemonList.reduce((closest, pokemon) => {
                const distance = levenshteinDistance(searchTerm, pokemon.name);
                return distance < closest.distance ? { distance, pokemon } : closest;
            }, { distance: Infinity, pokemon: null });

            currentPokemonIndex = closestPokemon.pokemon.url.split('/').slice(-2, -1)[0];
            displayPokemon();
        })
        .catch(error => console.error('Error searching closest Pokemon:', error));
}

// Função para calcular a distância de Levenshtein entre duas strings
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

// Exibição inicial
displayPokemon();
