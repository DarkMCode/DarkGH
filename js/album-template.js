const containers = document.querySelectorAll(".album-container");

containers.forEach(container => {
    const albumId = container.dataset.album;

    fetch("/DarkGH/includes/album-template.html")
        .then(r => r.text())
        .then(template => {
            container.innerHTML = template;

            return fetch(`/DarkGH/json/albums/${albumId}.json`);
        })
        .then(r => r.json())
        .then(data => {
            const name = container.querySelector("#album-name");
            const front = container.querySelector("#album-image-front");
            const back = container.querySelector("#album-image-back");

            name.textContent = data["name"];
            front.src = data["image-front"];
            back.src = data["image-back"];

            front.onclick = (event) => openMenu(event, data.links);
            back.onclick = (event) => openMenu(event, data.links);
        });
    });

function openMenu(event, links) {
    event.stopPropagation();

    const menu = document.getElementById("album-menu");

    if (menu.style.display === "flex") {
        menu.style.display = "none";
        return;
    }

    menu.innerHTML = "";

    for (const name in links) {
        const a = document.createElement("a");

        a.href = links[name];
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const img = document.createElement("img");

        img.src = `/DarkGH/assets/logos/plateformes/${name}-logo.png`;
        img.classList.add("menu-logo");

        a.appendChild(img);
        menu.appendChild(a);
    }

    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    menu.style.display = "flex";
}

document.addEventListener("click", () => {
    const menu = document.getElementById("album-menu");

    if (menu) {
        menu.style.display = "none";
    }
});

window.addEventListener("scroll", () => {
    const menu = document.getElementById("album-menu");

    if (menu) {
        menu.style.display = "none";
    }
});
