let switchMode = document.getElementById("switchMode");
switchMode.onclick = function() {
    let theme = document.getElementById("theme");
    if (theme.getAttribute("href") == "dark.css") {
        theme.href = "light.css";
    } else {
        theme.href = "dark.css"
    }
}
