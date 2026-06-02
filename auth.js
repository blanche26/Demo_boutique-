	let utilisateurs = [];
fetch('./users.json')
    .then(reponse => reponse.json())
    .then(data => {
        utilisateurs = data;
    })
    .catch(err => {
        console.error(err);
        utilisateurs = [
            { email: "prof@gmail.com", mdp: "1234", nom: "Monsieur le Professeur" }
        ];
    });

function verifierConnexion(event) {
    event.preventDefault();

    const emailSaisi = document.getElementById('email').value.trim().toLowerCase();
    const mdpSaisi = document.getElementById('mdp').value;
    const messageDiv = document.getElementById('message-retour');

    if (emailSaisi === "" || mdpSaisi === "") {
        messageDiv.innerHTML = "Attention : veuillez remplir tous les champs.";
        messageDiv.style.color = "orange";
        return;
    }

    const utilisateurTrouve = utilisateurs.find(u =>
        u.email.toLowerCase() === emailSaisi && u.mdp === mdpSaisi
    );

    if (utilisateurTrouve) {
        messageDiv.innerHTML = "Connexion réussie ! Bienvenue " + utilisateurTrouve.nom;
        messageDiv.style.color = "green";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        messageDiv.innerHTML = "Erreur : email ou mot de passe incorrect.";
        messageDiv.style.color = "red";
    }
}
