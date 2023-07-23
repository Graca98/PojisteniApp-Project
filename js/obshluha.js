const pojistenec = new Pojistenec()
pojistenec.vypisPojistenceDoTabulky()


// Vyvolá modal a schová ho
window.addEventListener('DOMContentLoaded', (event) => {
    const modal = new bootstrap.Modal(document.getElementById('modal-pop'));
    modal.hide();
});
