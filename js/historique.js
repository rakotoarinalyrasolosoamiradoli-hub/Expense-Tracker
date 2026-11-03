const affichage = document.querySelector("#tableauDepenses");

function historique(depenses) {

    affichage.replaceChildren();

    depenses.forEach((depense, index) => {

        // Création de la ligne
        const ligne = document.createElement("tr");

        // Création des cellules
        const tdDescription = document.createElement("td");
        const tdMontant = document.createElement("td");
        const tdCategorie = document.createElement("td");
        const tdDate = document.createElement("td");
        const tdAction = document.createElement("td");

        // Insertion des données
        tdDescription.textContent = depense.description;
        tdMontant.textContent = depense.montant.toLocaleString("fr-FR") + " Ar";
        tdCategorie.textContent = depense.categorie;
        tdDate.textContent = depense.date;

        // Création du bouton supprimer
        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.textContent = "Supprimer";

        // Événement de suppression
        boutonSupprimer.addEventListener("click", () => {

            if (confirm("Voulez-vous vraiment supprimer cette dépense ?")) {

                const nouvellesDepenses = depenses.filter(
                    (depense,i) => i !== index
                );

                localStorage.setItem(
                    "depenses",
                    JSON.stringify(nouvellesDepenses)
                );

                historique();
            }
        });

        // Assemblage des cellules
        tdAction.appendChild(boutonSupprimer);

        ligne.appendChild(tdDescription);
        ligne.appendChild(tdMontant);
        ligne.appendChild(tdCategorie);
        ligne.appendChild(tdDate);
        ligne.appendChild(tdAction);

        // Ajout de la ligne au tableau
        affichage.appendChild(ligne);
    });
}


//Total des dépenses
function totalDepense(){
    const afficheTotal = document.querySelector("#afficheTotal");

    let depenses = JSON.parse(localStorage.getItem("depenses")) || [];
    let totalMontant = 0;

    depenses.forEach((depense) => {
        totalMontant += Number(depense.montant);
    });

    afficheTotal.textContent = totalMontant.toLocaleString("fr-FR") + " Ariary";

}

//Algorithme de trie des données
function filtrerDonnees() {
    let depenses = JSON.parse(localStorage.getItem("depenses")) || [];

    let depensesTriees = [...depenses].sort((recent, ancien) => {
        return new Date(ancien.date) - new Date(recent.date);
    });

    return depensesTriees;
}

function actualiserAffichage() {
    let depensesTriees = filtrerDonnees();

    historique(depensesTriees);
    totalDepense();
    afficherGraphique();
}

//Graphe : NOTE!!! => chart : 50 % prompt via chatGPT
let graphique = null;

function afficherGraphique() {

    // Récupération des dépenses
    let depenses = JSON.parse(localStorage.getItem("depenses")) || [];

    // Regroupement des dépenses par jour
    let depensesParJour = {};

    depenses.forEach((depense) => {
        let date = depense.date;

        depensesParJour[date] =
            (depensesParJour[date] || 0) + Number(depense.montant);
    });

    // Transformation en tableaux
    let dates = Object.keys(depensesParJour).sort();

    let montants = dates.map((date) => depensesParJour[date]);

    // Calcul de la moyenne journalière
    let moyenne = montants.length > 0
        ? montants.reduce((total, montant) => total + montant, 0) / montants.length
        : 0;

    // Récupération du canvas
    const canvas = document.querySelector("#graphiqueDepenses");

    // Détruire l'ancien graphique avant de le recréer
    if (graphique) {
        graphique.destroy();
    }

    // Création du graphique
    graphique = new Chart(canvas, {
        type: "bar",

        data: {
            labels: dates,

            datasets: [
                {
                    label: "Dépenses journalières",
                    data: montants,
                    backgroundColor: "rgba(50, 152, 245, 0.55)",
                    borderColor: "#3298f5",
                    borderWidth: 1,
                    borderRadius: 8
                },
                {
                    type: "line",
                    label: "Moyenne journalière",
                    data: dates.map(() => moyenne),
                    borderColor: "#e69b32",
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + " : " +
                                context.parsed.y.toLocaleString("fr-FR") +
                                " Ar";
                        }
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString("fr-FR") + " Ar";
                        }
                    }
                }
            }
        }
    });
}

actualiserAffichage();