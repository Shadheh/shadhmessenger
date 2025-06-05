
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
}
document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();
  const form = new FormData(document.getElementById("uploadForm"));
  const res = await fetch("/upload", { method: "POST", body: form });
  const data = await res.json();
  if (data.success) {
    alert("Uploaded: " + data.filename);
  }
};
