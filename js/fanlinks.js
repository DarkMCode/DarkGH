fetch("/json/fanlinks.json")
    .then(r => r.json())
    .then(async fanlinks => {

        const table = document.getElementById("fanlinks-table");

        table.style.width = "200px";

        for (const name in fanlinks) {
            const link = fanlinks[name]["link"];
            const logo = fanlinks[name]["logo"];

            // Vérifier extension
            if (!logo.toLowerCase().endsWith(".png")) {
                console.warn("Format non valide : ", logo);
                continue;
            }

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.style.backgroundImage = `url("${logo}")`;
            cell.style.backgroundSize = "100px auto";
            cell.style.backgroundPosition = "center";
            cell.style.backgroundRepeat = "no-repeat";

            // Lecture du son
            cell.onclick = () => {
                window.open(link, "_blank");
            };

            row.appendChild(cell);
            table.appendChild(row);
        }
    });
