var produits = [];
var panier = [];

window.onload = function() {
    chargerProduits();
    
    var barre = document.getElementById("barre-recherche");
    if (barre) {
        barre.oninput = function() {
            var saisie = barre.value.toLowerCase();
            var resultatFiltre = [];
            for (var i = 0; i < produits.length; i++) {
                if (produits[i].name.toLowerCase().indexOf(saisie) !== -1) {
                    resultatFiltre.push(produits[i]);
                }
            }
            afficherLeCatalogue(resultatFiltre);
        };
    }
};

function chargerProduits() {
    fetch("products.json")
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(donnees) {
            produits = donnees;
            afficherLeCatalogue(produits);
        })
        .catch(function(erreur) {
            console.log("Erreur JSON, utilisation des données de secours");
            produits = [
                {id: 1, name: "Gants", category: "Mode", price: 2000},
                {id: 2, name: "Bijou Fantaisie", category: "Accessoires", price: 6000},
                {id: 3, name: "Casquette stylee", category: "Mode", price: 7000}
            ];
            afficherLeCatalogue(produits);
        });
}

function formatPrice(prix) {
    return prix + " XAF";
}

function afficherLeCatalogue(liste) {
    var zoneCatalogue = document.getElementById("charge_produit");
    if (!zoneCatalogue) return;
    
    zoneCatalogue.innerHTML = "";
    var listeAAfficher = liste || produits;
    
    for (var i = 0; i < listeAAfficher.length; i++) {
        var p = listeAAfficher[i];
        zoneCatalogue.innerHTML += '<div class="carte-produit">' +
            '<h3>' + p.name + '</h3>' +
            '<p>Catégorie : ' + p.category + '</p>' +
            '<p>Prix : ' + formatPrice(p.price) + '</p>' +
            '<button onclick="ajouterAuPanier(' + p.id + ')">Ajouter</button>' +
        '</div>';
    }
}

function ajouterAuPanier(idDuProduit) {
    var prodSelectionne = null;
    for (var i = 0; i < produits.length; i++) {
        if (produits[i].id == idDuProduit) {
            prodSelectionne = produits[i];
        }
    }

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

function mettreAJourLeRendu() {
    var corpsTableau = document.getElementById("lignes-du-panier");
    var zoneTotal = document.getElementById("total-panier");
    if (!corpsTableau) return;
    
    corpsTableau.innerHTML = "";
    var calculTotal = 0;
    
    for (var i = 0; i < panier.length; i++) {
        var item = panier[i];
        var sousTotal = item.price * item.quantite;
        calculTotal = calculTotal + sousTotal;
        
        corpsTableau.innerHTML += '<tr>' +
            '<td>' + item.name + '</td>' +
            '<td>' + formatPrice(item.price) + '</td>' +
            '<td>' + item.quantite + '</td>' +
            '<td>' + formatPrice(sousTotal) + '</td>' +
            '<td>' +
                '<button onclick="modifierQuantite(' + item.id + ', 1)">+</button>' +
                '<button onclick="modifierQuantite(' + item.id + ', -1)">-</button>' +
            '</td>' +
        '</tr>';
    }
    if (zoneTotal) zoneTotal.textContent = formatPrice(calculTotal);
}

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

var boutonVider = document.getElementById("vider-panier");
if (boutonVider) {
    boutonVider.onclick = function() {
        panier = [];
        mettreAJourLeRendu();
    };
}
