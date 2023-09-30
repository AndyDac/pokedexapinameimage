import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

public class Main {
    public static void main(String[] args) {
        try {
            // Fazendo uma solicitação à PokéAPI para obter informações sobre todos os
            // Pokémon
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://pokeapi.co/api/v2/pokemon?limit=10"))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Analisando a resposta JSON
            JSONObject json = new JSONObject(response.body());
            JSONArray results = json.getJSONArray("results");

            Pokedex pokedex = new Pokedex();

            // Iterando sobre os resultados e obtendo informações detalhadas sobre cada
            // Pokémon
            for (int i = 0; i < results.length(); i++) {
                JSONObject pokemonInfo = results.getJSONObject(i);
                String pokemonName = pokemonInfo.getString("name");

                // Fazendo uma nova solicitação para obter informações detalhadas sobre cada
                // Pokémon
                HttpRequest pokemonRequest = HttpRequest.newBuilder()
                        .uri(URI.create("https://pokeapi.co/api/v2/pokemon/" + pokemonName))
                        .build();

                HttpResponse<String> pokemonResponse = client.send(pokemonRequest,
                        HttpResponse.BodyHandlers.ofString());
                JSONObject pokemonJson = new JSONObject(pokemonResponse.body());

                String pokemonType = pokemonJson.getJSONArray("types").getJSONObject(0).getJSONObject("type")
                        .getString("name");

                // Adicionando o Pokémon à Pokedex
                pokedex.adicionarPokemon(new Pokemon(pokemonName, pokemonType));
            }

            // Exibindo a Pokedex
            pokedex.exibirPokedex();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class Pokemon {
    private String nome;
    private String tipo;

    public Pokemon(String nome, String tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    public String getNome() {
        return nome;
    }

    public String getTipo() {
        return tipo;
    }

    @Override
    public String toString() {
        return "Nome: " + nome + ", Tipo: " + tipo;
    }
}

class Pokedex {
    private List<Pokemon> pokemons;

    public Pokedex() {
        this.pokemons = new ArrayList<>();
    }

    public void adicionarPokemon(Pokemon pokemon) {
        pokemons.add(pokemon);
    }

    public void exibirPokedex() {
        System.out.println("Pokedex:");
        for (Pokemon pokemon : pokemons) {
            System.out.println(pokemon);
        }
    }
}
