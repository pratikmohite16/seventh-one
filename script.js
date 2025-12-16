const dateEl = document.getElementById("date");
dateEl.textContent = new Date().toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });

const toast = document.getElementById("toast");
function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=>toast.classList.remove("show"), 3500);
}

document.getElementById("btnMemory").addEventListener("click", () => {
  showToast("A small memory: even when I’m busy, my brain still finds you.");
});

document.getElementById("btnPromise").addEventListener("click", () => {
  showToast("A promise: I’ll keep showing up—softly, consistently, honestly.");
});
