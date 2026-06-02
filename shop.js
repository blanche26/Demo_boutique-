/*--- Style.CSS --- */
/*project boutique Démo - etudiant */
// Liste de nos produits
let produits = [
    {"id": 1, "nom": "Sac à dos étudiant", "prix": 12000},
    {"id": 2, "nom": "Clé USB 64 Go", "prix": 4500},
    {"id": 3, "nom": "Cahier de TD 200p", "prix": 1500},
    {"id": 4, "nom": "Boîte de stylos", "prix": 1000}
];

let panier = [];

// Lance l'affichage dès que la page s'ouvre
window.onload = function() {
    afficherLeCatalogue();
};

// Crée les cartes de produits
function afficherLeCatalogue() {
    const zoneCatalogue = document.getElementById('charge_produit');
    if (!zoneCatalogue) return;
    
    zoneCatalogue.innerHTML = '';
    
    produits.forEach(p => {
        const carte = document.createElement('div');
        carte.className = 'carte-produit'; // Utilise la classe CSS
        
        carte.innerHTML = `
            <h4>${p.nom}</h4>
            <p>Prix : ${p.prix} XAF</p>
            <button onclick="ajouterAuPanier(${p.id})">Ajouter au panier</button>
        `;
        zoneCatalogue.appendChild(carte);
    });
}

// Gère l'ajout
function ajouterAuPanier(idDuProduit) {
    const prodSelectionne = produits.find(p => p.id === idDuProduit);
    const produitExiste = panier.find(item => item.id === idDuProduit);

    if (produitExiste) {
        produitExiste.quantite++;
    } else {
        panier.push({
            id: prodSelectionne.id,
            nom: prodSelectionne.nom,
            prix: prodSelectionne.prix,
            quantite: 1
        });
    }
    mettreAJourLeRendu();
}

// Calcule le total et crée les lignes de ton tableau
function mettreAJourLeRendu() {
    const corpsTableau = document.getElementById('lignes-du-panier');
    const zoneTotal = document.getElementById('total-panier');
    
    corpsTableau.innerHTML = '';
    let calculTotal = 0;

    panier.forEach(item => {
        const sousTotal = item.prix * item.quantite;
        calculTotal += sousTotal;

        const ligne = document.createElement('tr');
        ligne.innerHTML = `
            <td>${item.nom}</td>
            <td>${item.prix} XAF</td>
            <td>${item.quantite}</td>
            <td>${sousTotal} XAF</td>
            <td><button onclick="retirerDuPanier(${item.id})">Retirer</button></td>
        `;
        corpsTableau.appendChild(ligne);
    });

    zoneTotal.textContent = calculTotal;
}

// Gère le retrait
function retirerDuPanier(idDuProduit) {
    const produitExiste = panier.find(item => item.id === idDuProduit);
    
    if (produitExiste.quantite > 1) {
        produitExiste.quantite--;
    } else {
        panier = panier.filter(item => item.id !== idDuProduit);
    }
    mettreAJourLeRendu();
}

// Vide le panier
document.getElementById('vider-panier').addEventListener('click', () => {
    panier = [];
    mettreAJourLeRendu();
});
