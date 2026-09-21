fetch("/includes/header.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("header").innerHTML = html;
        document.dispatchEvent(new Event("headerLoaded"));
    });