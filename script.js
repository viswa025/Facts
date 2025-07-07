function toggleDropdown(id) {
  document.querySelectorAll(".dropdown").forEach(el => {
    if (el.id !== id) el.style.display = "none";
  });
  const dropdown = document.getElementById(id);
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
  if (!event.target.matches("button")) {
    document.querySelectorAll(".dropdown").forEach(el => el.style.display = "none");
  }
};
