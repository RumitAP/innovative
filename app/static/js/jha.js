let currentPage = 1;
let jsonData;

function fetchJHA(page = 1) {
    fetch(`${apiUrlJHA}?page=${page}`)
        .then(response => response.json())
        .then(data => {
            currentPage = data.current_page;
            const totalPages = data.total_pages;
            const tableBody = document.getElementById('jha-table-body');

            tableBody.innerHTML = data.items.map(item => `
                <tr>
                    <td>${item.created_utc}</td>
                    <td>${item.title}</td>
                    <td>${item.author}</td>
                    <td>${item.updated_utc}</td>
                    <td>${item.status}</td>
                    <td>
                        <i class="fas fa-eye" onclick="viewJHA(${item.id})"></i>
                        <i class="fas fa-edit" onclick="editJHA(${item.id})"></i>
                        <i class="fas fa-trash" onclick="deleteJHA(${item.id})"></i> <!-- Add this line -->
                    </td>
                </tr>
            `).join('');

            updatePagination(totalPages);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function viewJHA(jhaId) {

    fetch(`${apiUrlJHA}/${jhaId}`)
        .then(response => response.json())
        .then(jha => {
            document.getElementById('modal-title').innerHTML = '<strong>Title:</strong> ' + jha.title;
            document.getElementById('modal-author').innerHTML = '<strong>Author:</strong> ' + jha.author;

            const tasksContainer = document.getElementById('modal-tasks');
            tasksContainer.innerHTML = ''; // Clear previous tasks

            jha.tasks.forEach((task, index) => {
                let taskNumber = index + 1;
                let taskEl = document.createElement('p');
                taskEl.innerHTML = `<strong>Task ${taskNumber}</strong>: ${task.task_description}`;
                tasksContainer.appendChild(taskEl);

                task.hazards.forEach(hazard => {
                    let hazardEl = document.createElement('p');
                    hazardEl.innerHTML = `&nbsp;• Hazard: ${hazard.description}`;
                    tasksContainer.appendChild(hazardEl);

                    let pmEl = document.createElement('p');
                    pmEl.innerHTML = `&nbsp;&nbsp;&nbsp;• Preventative Measures: ${hazard.preventative_measures.map(pm => pm.description).join(', ')}`;
                    tasksContainer.appendChild(pmEl);

                    let consEl = document.createElement('p');
                    consEl.innerHTML = `&nbsp;&nbsp;&nbsp;• Consequences: ${hazard.consequences.map(con => con.description).join(', ')}`;
                    tasksContainer.appendChild(consEl);
                });
            });

            document.getElementById('jha-detail-modal').classList.add('is-active');
        })
    .catch(error => {
        console.error('Error fetching edit form:', error);
    });
    
}

function editJHA(jhaId) {
    fetch(`${apiUrlJHA}/${jhaId}`)
        .then(response => response.json())
        .then(data => {
            toggleEditModal();
            populateEditForm(data, jhaId)
    })
    .catch(error => {
        console.error('Error fetching edit form:', error);
    });
}

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

function submitEditJHA() {
    const title = document.getElementById('edit-title').value;
    const author = document.getElementById('edit-author').value;
    const id = document.getElementById('edit-id').value;

    const jsonData = {
        "title": title,
        "author": author
    };

    fetch(`${apiUrlJHA}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jsonData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error saving JHA');
        }
        return response.json();
    })
    .then(() => {
        alert('JHA updated successfully');
        toggleEditModal();
        fetchJHA(currentPage);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem saving the JHA details.');
    });
}

function deleteJHA(jhaId) {
    if (!confirm('Are you sure you want to delete this JHA?')) {
        return;
    }

    fetch(`${apiUrlJHA}/${jhaId}`, {
        method: 'DELETE',
        headers: {
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting JHA');
        }
        if (response.status === 204) {
            alert('JHA deleted successfully');
            fetchJHA(currentPage);
        } else {
            return response.json();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem deleting the JHA.');
    });
}

function formatArrayOrObject(data) {
    if (Array.isArray(data)) {
        return data.join(', ');
    } else if (data && typeof data === 'object') {
        return data.name || data.description || JSON.stringify(data);
    }
    return 'N/A';
}

function closeJHAModal() {
    document.getElementById('jha-detail-modal').classList.remove('is-active');
}

function addTask() {
    const taskDescriptionInput = document.getElementById('task_description_input');
    const taskDescription = taskDescriptionInput.value.trim();

    if (taskDescription === "") {
        alert("Please enter a task description.");
        return;
    }

    const taskList = document.getElementById('tasks-container');
    const numberOfTasks = taskList.getElementsByClassName('task-item').length;

    const taskData = {
        task_description: taskDescription,
        jha_id: jsonData.jha_id,
        step: numberOfTasks + 1
    };

    fetch(apiUrlTasks, {
        method: 'POST',
        body: JSON.stringify(taskData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const taskId = data.id;

        const taskList = document.getElementById('tasks-container');
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.dataset.taskId = taskId;
        taskElement.innerHTML = `
            <span class="delete-task-button" onclick="deleteTask(this, ${taskId})">&#x1F5D1;</span>
            <div class="task-description">${taskDescription}</div>
            <div class="hazards-container"></div>
            <button type="button" class="button is-primary add-hazard-button" onclick="addHazard(this, ${taskId})">Add Hazard</button>
        `;
        taskList.appendChild(taskElement);
        
        taskDescriptionInput.value = '';
        
        const submitButton = document.getElementById('submit-tasks');
        if (submitButton) {
            submitButton.classList.remove('is-hidden');
            submitButton.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error adding the task.");
    });
}

function addHazard(button, taskId) {
    const taskItem = button.closest('.task-item');
    const hazardsContainer = taskItem.querySelector('.hazards-container');
    const hazardElement = document.createElement('div');
    hazardElement.classList.add('hazard-item');
    hazardElement.innerHTML = `
        <div class="hazard-description">
            <label class="label">Hazard Description</label>
            <input class="input hazard-input" type="text" placeholder="Hazard Description">
            <button type="button" class="button is-primary submit-hazard-button">Submit Hazard</button>
        </div>
        <div class="consequences-container">
            <label class="label">Consequences</label>
            <button type="button" class="button is-primary add-consequence-button" disabled>Add Consequence</button>
        </div>
        <div class="preventative-measures-container">
            <label class="label">Preventative Measures</label>
            <button type="button" class="button is-primary add-preventative-measure-button" disabled>Add Preventative Measure</button>
        </div>
    `;
    const submitHazardButton = hazardElement.querySelector('.submit-hazard-button');
    submitHazardButton.addEventListener('click', function() {
        submitHazard(this, taskId);
    });
    hazardsContainer.appendChild(hazardElement);
}

function addConsequence(hazardElement, hazardId) {
    const consequenceElement = document.createElement('div');
    consequenceElement.classList.add('consequence-item');
    
    // Add input for consequence
    const consequenceInput = document.createElement('input');
    consequenceInput.classList.add('input', 'consequence-input');
    consequenceInput.type = 'text';
    consequenceInput.placeholder = 'Consequence Description';
    consequenceElement.appendChild(consequenceInput);

    // Add submit button for consequence
    const submitConsequenceButton = document.createElement('button');
    submitConsequenceButton.textContent = 'Submit Consequence';
    submitConsequenceButton.classList.add('button', 'is-primary', 'submit-consequence-button');
    submitConsequenceButton.onclick = function() {
        submitConsequence(this, hazardId);
    };
    consequenceElement.appendChild(submitConsequenceButton);
    
    // Append the consequence element to its container
    const consequencesContainer = hazardElement.querySelector('.consequences-container');
    consequencesContainer.appendChild(consequenceElement);
}

function addPreventativeMeasure(hazardElement, hazardId) {
    // Create a container for the preventative measure input and button
    const preventativeMeasureElement = document.createElement('div');
    preventativeMeasureElement.classList.add('preventative-measure-item');
    
    // Add input for preventative measure
    const preventativeMeasureInput = document.createElement('input');
    preventativeMeasureInput.classList.add('input', 'preventative-measure-input');
    preventativeMeasureInput.type = 'text';
    preventativeMeasureInput.placeholder = 'Preventative Measure Description';
    preventativeMeasureElement.appendChild(preventativeMeasureInput);

    // Add submit button for preventative measure
    const submitPreventativeMeasureButton = document.createElement('button');
    submitPreventativeMeasureButton.textContent = 'Submit Preventative Measure';
    submitPreventativeMeasureButton.classList.add('button', 'is-primary', 'submit-preventative-measure-button');
    submitPreventativeMeasureButton.onclick = function() {
        submitPreventativeMeasure(this, hazardId);
    };
    preventativeMeasureElement.appendChild(submitPreventativeMeasureButton);
    
    // Append the preventative measure element to its container
    const preventativeMeasuresContainer = hazardElement.querySelector('.preventative-measures-container');
    preventativeMeasuresContainer.appendChild(preventativeMeasureElement);
}

function updatePagination(totalPages) {
    const paginationList = document.getElementById('pagination-list');
    paginationList.innerHTML = '';
    const prevButton = document.querySelector('.pagination-previous');
    const nextButton = document.querySelector('.pagination-next');

    if (currentPage <= 1) {
        prevButton.classList.add('is-disabled');
        prevButton.removeAttribute('onclick'); // Remove the onclick event if disabled
    } else {
        prevButton.classList.remove('is-disabled');
        prevButton.setAttribute('onclick', 'fetchJHA(currentPage - 1)');
    }

    if (currentPage >= totalPages) {
        nextButton.classList.add('is-disabled');
        nextButton.removeAttribute('onclick');
    } else {
        nextButton.classList.remove('is-disabled');
        nextButton.setAttribute('onclick', 'fetchJHA(currentPage + 1)');
    }
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = `<li><a class="pagination-link ${page === currentPage ? 'is-current' : ''}" aria-label="Goto page ${page}" onclick="fetchJHA(${page})">${page}</a></li>`;
        paginationList.innerHTML += pageItem;
    }
}

function toggleModal() {
    var modal = document.getElementById('new-jha-modal');
    modal.classList.toggle('is-active');
}
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

function submitJHA() {
    const form = document.getElementById('new-jha-form');
    const formData = new FormData(form);
    jsonData = Object.fromEntries(formData.entries());

    fetch(apiUrlJHA, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error, title must be unique and author must be provided.");
        }
        return response.json();
    })
    .then(data => {
        form.classList.add('is-hidden');
        const tasksForm = document.getElementById('jha-tasks-form');
        tasksForm.classList.remove('is-hidden');
        jsonData.jha_id = data.id;
    })
    .catch((error) => {
        console.error('Error:', error);
        displayErrorMessage(error.message);
    });
}

function submitTasks() {
    const taskItems = document.querySelectorAll('.task-item');
    const tasks = Array.from(taskItems).map(taskItem => {
        const taskDescription = taskItem.querySelector('.task-description').textContent.trim();
        const hazards = Array.from(taskItem.querySelectorAll('.hazard-item')).map(hazardItem => {
            const hazardDescription = hazardItem.querySelector('.hazard-input').value.trim();
            const consequences = Array.from(hazardItem.querySelectorAll('.consequence-input')).map(input => input.value.trim()).filter(description => description !== '');
            const preventativeMeasures = Array.from(hazardItem.querySelectorAll('.preventative-measure-input')).map(input => input.value.trim()).filter(description => description !== '');
            return {
                description: hazardDescription,
                consequences: consequences,
                preventative_measures: preventativeMeasures,
                jha_id: jsonData.jha_id
            };
        });
        return {
            task_description: taskDescription,
            hazards: hazards,
        };
    });

    const dataToSubmit = {
        jha_id: jsonData.jha_id,
        tasks: tasks
    };

    fetch(apiUrlTasks, {
        method: 'POST',
        body: JSON.stringify(dataToSubmit),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tasks submitted successfully:', data);
    })
    .catch(error => {
        console.error('Error submitting tasks:', error);
    });
}

function submitHazard(button, taskId) {
    const hazardItem = button.closest('.hazard-item');
    const hazardDescriptionInput = hazardItem.querySelector('.hazard-input');
    const hazardDescription = hazardDescriptionInput.value.trim();
    const hazardId = hazardItem.dataset.hazardId;

    if (hazardDescription === "") {
        alert("Please enter a hazard description.");
        return;
    }

    const hazardData = {
        description: hazardDescription,
        task_id: taskId
    };

    const method = hazardId ? 'PUT' : 'POST';
    const endpoint = hazardId ? `${apiUrlHazard}/${hazardId}` : apiUrlHazard;

    fetch(endpoint, {
        method: method,
        body: JSON.stringify(hazardData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        hazardItem.dataset.hazardId = data.id;
    
        const addConsequenceButton = hazardItem.querySelector('.add-consequence-button');
        addConsequenceButton.disabled = false;
        addConsequenceButton.addEventListener('click', function() {
            addConsequence(hazardItem, hazardItem.dataset.hazardId);
        });
    
        const addPreventativeMeasureButton = hazardItem.querySelector('.add-preventative-measure-button');
        addPreventativeMeasureButton.disabled = false;
        addPreventativeMeasureButton.addEventListener('click', function() {
            addPreventativeMeasure(hazardItem, hazardItem.dataset.hazardId);
        });
    
        button.textContent = 'Update Hazard';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error submitting the hazard.");
    });
}

function submitConsequence(button, hazardId) {
    const consequenceElement = button.closest('.consequence-item');
    const consequenceInput = consequenceElement.querySelector('.consequence-input');
    const description = consequenceInput.value.trim();
    const consequenceId = consequenceElement.dataset.consequenceId;
    const hazardItem = button.closest('.hazard-item');
    hazardId = hazardItem.dataset.hazardId;

    if (description === "") {
        alert("Please enter a consequence description.");
        return;
    }

    const data_m = {
        description: description,
        job_hazard_analysis_task_hazard_id: hazardId
    };

    const method = consequenceId ? 'PUT' : 'POST';
    const endpoint = consequenceId ? `${apiUrlConsequences}/${consequenceId}` : apiUrlConsequences;

    const taskDescriptionInput = document.getElementById('task_description_input');
    taskDescriptionInput.value = '';

    fetch(endpoint, {
        method: method,
        body: JSON.stringify(data_m),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        consequenceElement.dataset.consequenceId = data.id;
        button.textContent = 'Update Consequence';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error submitting the consequence.");
    });
}

function submitPreventativeMeasure(button, hazardId) {
    const preventativeMeasureElement = button.closest('.preventative-measure-item');
    const preventativeMeasureInput = preventativeMeasureElement.querySelector('.preventative-measure-input');
    const description_pm = preventativeMeasureInput.value.trim();
    const preventativeMeasureId = preventativeMeasureElement.dataset.preventativeMeasureId;

    if (description_pm === "") {
        alert("Please enter a preventative measure description.");
        return;
    }

    const data = {
        description: description_pm,
        job_hazard_analysis_task_hazard_id: hazardId
    };

    const method = preventativeMeasureId ? 'PUT' : 'POST';
    const endpoint_pm = preventativeMeasureId ? `${apiUrlPMs}/${preventativeMeasureId}` : apiUrlPMs;

    const taskDescriptionInput = document.getElementById('task_description_input');
    taskDescriptionInput.value = '';

    fetch(endpoint_pm, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        preventativeMeasureElement.dataset.preventativeMeasureId = data.id;
        button.textContent = 'Update Preventative Measure';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error submitting the preventative measure.");
    });
}

function deleteTask(element, taskId) {
    if (!confirm('Are you sure you want to delete this JHA?')) {
        return;
    }

    fetch(`${apiUrlTasks}/${taskId}`, {  // Removed .value to directly use taskId
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting JHA');
        }
        if (response.status === 204) {
            alert('JHA deleted successfully');
            const taskElement = element.closest('.task-item');
            if (taskElement) {
                taskElement.remove();
            }
        } else {
            return response.json();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem deleting the JHA.');
    });
}

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove('is-hidden'); 

    setTimeout(() => {
        errorMessageDiv.classList.add('is-hidden');
    }, 10000); 
}

document.addEventListener('DOMContentLoaded', function() {
    fetchJHA();
});