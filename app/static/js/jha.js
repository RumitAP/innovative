
const finishButton = document.getElementById('finish-button-id');
finishButton.textContent = 'Finish'; // Change the button text to 'Finish'
finishButton.addEventListener('click', function() {
    document.getElementById('new-jha-form').reset();
    
    // Clear the tasks and dynamically added elements within 'jha-tasks-form'
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // This removes all tasks

    jsonData = {};

    // Hide the tasks form and show the initial JHA form
    const newJhaForm = document.getElementById('new-jha-form');
    const jhaTasksForm = document.getElementById('jha-tasks-form');
    newJhaForm.classList.remove('is-hidden');
    jhaTasksForm.classList.add('is-hidden');
    const submitButton = document.getElementById('submit-tasks');
    if (submitButton) {
        submitButton.classList.add('is-hidden');
        submitButton.disabled = true;
    }

    // Hide the modal
    toggleModal();
    fetchJHA(currentPage); // Refresh the JHA list if needed
});

document.getElementById('show-modal').addEventListener('click', function() {
    // Reset the form in case it was not reset properly
    document.getElementById('new-jha-form').reset();

    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // This removes all tasks

    jsonData = {};

    const newJhaForm = document.getElementById('new-jha-form');
    const jhaTasksForm = document.getElementById('jha-tasks-form');
    newJhaForm.classList.remove('is-hidden');
    jhaTasksForm.classList.add('is-hidden');

    const submitButton = document.getElementById('submit-tasks');
    if (submitButton) {
        submitButton.classList.add('is-hidden');
        submitButton.disabled = true;
    }

    // Hide the modal
    toggleModal();
    fetchJHA(currentPage);
});

document.addEventListener('DOMContentLoaded', function() {
    fetchJHA();
});