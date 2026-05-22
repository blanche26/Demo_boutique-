/*--- Style.CSS --- */
/*project boutique Démo - etudiant */
let produits = [];

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        produits = data;
        afficherProduits(produits); // Affiche tout au début
    })
    .catch(error => {
        console.error("Erreur de chargement, je charge une liste par défaut :", error);
        // Fallback en dur si le JSON ne charge pas
        produits = [{ id: 1, name: "Produit de secours", price: 1000, category: "Test" }];
        afficherProduits(produits);
    });

// 11. Fonction pour formater le prix avec XAF
function formatPrice(prix) {
    return prix + " XAF";
}

// 13. Recherche : filtrer par nom (insensible à la casse)
function filtrerProduits(terme) {
    const resultat = produits.filter(p =>
        p.name.toLowerCase().includes(terme.toLowerCase())
    );
    afficherProduits(resultat);
}

// 14. Tri des prix (croissant / décroissant)
function trierProduits(mode) {
    let tri = [...produits]; // Copie du tableau
    if (mode === 'croissant') {
        tri.sort((a, b) => a.price - b.price);
    } else {
        tri.sort((a, b) => b.price - a.price);
    }
    afficherProduits(tri);
}

// 15, 16, 17. Gestion du panier
let panier = [];

function ajouterAuPanier(produit) {
   alert("Produit ajouté ! Total : " + calculerTotal() + " XAF");
    let existant = panier.find(item => item.id === produit.id);
    if (existant) {
        existant.quantite++;
    } else {
        panier.push({...produit, quantite: 1 });
    }
}

// 17. Calcul du total avec une boucle for
function calculerTotal() {
    let total = 0;
    for (let i = 0; i < panier.length; i++) {
        total += panier[i].price * panier[i].quantite;
    }
    return total;
}

// Fonction utilitaire pour afficher les produits
function afficherProduits(liste) {
    const container = document.querySelector('.grid-container');
    container.innerHTML = ""; // On vide avant d'afficher
    liste.forEach(p => {
        container.innerHTML += `
            <div class="produit-card">
                <h3>${p.name}</h3>
                <p>${formatPrice(p.price)}</p>
                 <button onclick='ajouterAuPanier(${JSON.stringify(p).replace(/"/g, "&quot;")})'>Ajouter</button>
                 
            </div>
        `;
    });
}
