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

    var liens = document.querySelectorAll("header ul li a");
    for (var i = 0; i < liens.length; i++) {
        liens[i].onclick = function(e) {
            var cibleId = this.getAttribute("href");
            if (cibleId.startsWith("#")) {
                e.preventDefault();
                var cibleSection = document.querySelector(cibleId);
                if (cibleSection) {
                    cibleSection.scrollIntoView({ behavior: "smooth" });
                }
            }
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
            produits = [
                {id: 1, name: "Gants", category: "Mode", price: 2000},
                {id: 2, name: "Bijou Fantaisie", category: "Accessoires", price: 6000},
                {id: 3, name: "Casquette stylee", category: "Mode", price: 7000},
                {id: 4, name: "Smartphone X", category: "Electronique", price: 150000},
                {id: 5, name: "Casque Audio", category: "Electronique", price: 25000},
                {id: 6, name: "Ordinateur Portable", category: "Electronique", price: 350000},
                {id: 7, name: "Sac a dos", category: "Accessoires", price: 15000},
                {id: 8, name: "Chaussures de sport", category: "Mode", price: 25000}
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
    
    var listeAAfficher = liste || produits;
    
    var codeHtml = '<table border="1">' +
        '<thead>' +
            '<tr>' +
                '<th>Article</th>' +
                '<th>Catégorie</th>' +
                '<th>Prix</th>' +
                '<th>Action</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>';
        
    for (var i = 0; i < listeAAfficher.length; i++) {
        var p = listeAAfficher[i];
        codeHtml += '<tr>' +
            '<td>' + p.name + '</td>' +
            '<td>' + p.category + '</td>' +
            '<td>' + formatPrice(p.price) + '</td>' +
            '<td><button onclick="ajouterAuPanier(' + p.id + ')">Ajouter</button></td>' +
        '</tr>';
    }
    
    codeHtml += '</tbody></table>';
    zoneCatalogue.innerHTML = codeHtml;
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
                '<button onclick="modifierQuantite(' + item.id + ', 1)">+</button> ' +
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
