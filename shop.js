/*--- Style.CSS --- */
// Variables globales pour stocker nos donnees
var produits = [];
var panier = [];

// Au chargement de la page, on appelle le fichier JSON
window.onload = function() {
    chargerProduits();
};

// Question 10 : Chargement du fichier JSON avec fetch
function chargerProduits() {
    fetch("produit.json")
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(donnees) {
            produits = donnees;
            afficherLeCatalogue();
        })
        .catch(function(erreur) {
            console.log("Erreur de chargement, utilisation du tableau de secours");
            // Tableau de secours (fallback en dur si le fetch echoue)
            produits = [
                {id: 1, name: "Casquette stylee", category: "Mode", price: 7000, image: "casquette.jpg"},
                {id: 2, name: "Gants", category: "Mode", price: 2000, image: "gants.jpg"}
            ];
            afficherLeCatalogue();
        });
}

// Question 11 : Fonction formatPrice(prix)
function formatPrice(prix) {
    return prix + " XAF";
}

// Fonction pour afficher les produits dans le catalogue HTML
function afficherLeCatalogue() {
    // ATTENTION : On cherche l'element vert ou la zone catalogue de ton HTML
    // Si dans ton HTML c'est <div id="catalogue-liste">, change le nom ici !
    var zoneCatalogue = document.getElementById("charge_produit");
    if (!zoneCatalogue) return;
    
    zoneCatalogue.innerHTML = "";
    
    // Boucle for classique de niveau L1
    for (var i = 0; i < produits.length; i++) {
        var p = produits[i];
        
        zoneCatalogue.innerHTML += `
            <div class="carte-produit">
                <h4>${p.name}</h4>
                <p>Categorie : ${p.category}</p>
                <p>Prix : ${formatPrice(p.price)}</p>
                <button onclick="ajouterAuPanier(${p.id})">Ajouter au panier</button>
            </div>
        `;
    }
}

// Question 15 : Ajouter au panier (gestion des quantites)
function ajouterAuPanier(idDuProduit) {
    // 1. Trouver le produit dans le catalogue
    var prodSelectionne = null;
    for (var i = 0; i < produits.length; i++) {
        if (produits[i].id == idDuProduit) {
            prodSelectionne = produits[i];
        }
    }

    // 2. Verifier s'il est deja dans le panier
    var produitExiste = null;
    for (var j = 0; j < panier.length; j++) {
        if (panier[j].id == idDuProduit) {
            produitExiste = panier[j];
        }
    }

    if (produitExiste != null) {
        produitExiste.quantite++;
    } else {
        panier.push({
            id: prodSelectionne.id,
            name: prodSelectionne.name,
            price: prodSelectionne.price,
            quantite: 1
        });
    }
    mettreAJourLeRendu();
}

// Question 16 & 17 : Remplir le tableau du panier et calculer le total général
function mettreAJourLeRendu() {
    var corpsTableau = document.getElementById("lignes-du-panier");
    var zoneTotal = document.getElementById("total-panier");
    
    if (!corpsTableau || !zoneTotal) return;
    
    corpsTableau.innerHTML = "";
    var calculTotal = 0;

    // Boucle for pour generer le tableau ligne par ligne
    for (var i = 0; i < panier.length; i++) {
        var item = panier[i];
        var sousTotal = item.price * item.quantite;
        calculTotal = calculTotal + sousTotal; // Somme cumulative pour le total général

        corpsTableau.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${item.quantite}</td>
                <td>${formatPrice(sousTotal)}</td>
                <td>
                    <button onclick="modifierQuantite(${item.id}, 1)">+</button>
                    <button onclick="modifierQuantite(${item.id}, -1)">-</button>
                    <button onclick="supprimerDuPanier(${item.id})">Supprimer</button>
                </td>
            </tr>
        `;
    }

    zoneTotal.textContent = formatPrice(calculTotal);
}

// Modifier la quantite avec les boutons + et -
function modifierQuantite(idDuProduit, valeur) {
    for (var i = 0; i < panier.length; i++) {
        if (panier[i].id == idDuProduit) {
            panier[i].quantite = panier[i].quantite + valeur;
            if (panier[i].quantite <= 0) {
                panier.splice(i, 1);
            }
        }
    }
    mettreAJourLeRendu();
}

// Supprimer complement une ligne du panier
function supprimerDuPanier(idDuProduit) {
    for (var i = 0; i < panier.length; i++) {
        if (panier[i].id == idDuProduit) {
            panier.splice(i, 1);
        }
    }
    mettreAJourLeRendu();
}

// Bouton Vider le panier
var boutonVider = document.getElementById("vider-panier");
if (boutonVider) {
    boutonVider.onclick = function() {
        panier = [];
        mettreAJourLeRendu();
    };
}
