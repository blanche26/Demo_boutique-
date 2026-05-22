	// Charger les utilisateurs
	let utilisateurs = [];

	fetch('users.json')
	    .then(reponse => reponse.json())
	    .then(data => {
	        utilisateurs = data;
	    })
	    .catch(err => console.error("Problème de chargement des utilisateurs :", err));

	// Fonction de vérification au clic sur le bouton
	function verifierConnexion(event) {
	    event.preventDefault(); // Empêche la page de se recharger

	    const emailSaisi = document.getElementById('email').value.trim().toLowerCase();
	    const mdpSaisi = document.getElementById('mdp').value;
	    const messageDiv = document.getElementById('message-retour');

	    // Vérification des champs vides
	    if (emailSaisi === "" || mdpSaisi === "") {
	        messageDiv.innerHTML = "Attention : veuillez remplir tous les champs.";
	        messageDiv.style.color = "orange";
	        return;
	    }

	    // Vérification du couple email/mot de passe dans notre liste JSON
	    const utilisateurTrouve = utilisateurs.find(u =>
	        u.email.toLowerCase() === emailSaisi && u.mdp === mdpSaisi
	    );

	    if (utilisateurTrouve) {
	        messageDiv.innerHTML = "Connexion réussie ! Bienvenue " + utilisateurTrouve.nom;
	        messageDiv.style.color = "green";
	    } else {
	        messageDiv.innerHTML = "Erreur : email ou mot de passe incorrect.";
	        messageDiv.style.color = "red";
	    }
	}