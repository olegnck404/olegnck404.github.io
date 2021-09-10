let switchMode = document.getElementById("switchMode");
switchMode.onclick = function() {
    let theme = document.getElementById("theme");
    if (theme.getAttribute("href") == "Style/light.css") {
        theme.href = "Style/dark.css";
    } else {
        theme.href = "Style/light.css"
    }
}