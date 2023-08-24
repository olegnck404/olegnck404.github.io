let switchMode = document.getElementById("switchMode");
switchMode.onclick = function() {
    let theme = document.getElementById("theme");
    if (theme.getAttribute("href") == "dark.css") {
        theme.href = "light.css";
    } else {
        theme.href = "dark.css"
    }
}

window.addEventListener('load', function() {
    var currentDate = new Date();

    var birthDate = new Date("2006-06-03");

    var age = currentDate.getFullYear() - birthDate.getFullYear();

    var birthDateThisYear = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (currentDate < birthDateThisYear) {
        age--;
    }

    document.getElementById("age").textContent = age;
});