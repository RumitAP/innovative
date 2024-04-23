function toggleEditModal() {
    const modal = document.getElementById('edit-jha-modal');
    modal.classList.toggle('is-active');
}

function populateEditForm(jha, jhaId) {
    document.getElementById('edit-title').value = jha.title;
    document.getElementById('edit-author').value = jha.author;
    document.getElementById('edit-id').value = jhaId
}

function closeEditModal() {
    toggleEditModal();
}

function closeJHAModal() {
    document.getElementById('jha-detail-modal').classList.remove('is-active');
}

function toggleModal() {
    var modal = document.getElementById('new-jha-modal');
    modal.classList.toggle('is-active');
}