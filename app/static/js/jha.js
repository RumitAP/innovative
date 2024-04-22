let currentPage = 1;
let jsonData;

function fetchJHA(page = 1) {
    // Correct the query parameter for page number
    fetch(`${apiUrlJHA}?page=${page}`)
        .then(response => response.json())
        .then(data => {
            currentPage = data.current_page;
            const totalPages = data.total_pages;
            const tableBody = document.getElementById('jha-table-body');

            // Render items to table
            tableBody.innerHTML = data.items.map(item => `
                <tr>
                    <td>${item.created_utc}</td>
                    <td>${item.title}</td>
                    <td>${item.author}</td>
                    <td>${item.updated_utc}</td>
                    <td>${item.status}</td>
                </tr>
            `).join('');

            // Update pagination
            updatePagination(totalPages);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function addTask() {
    const taskDescriptionInput = document.getElementById('task_description_input');
    const taskDescription = taskDescriptionInput.value.trim();

    if (taskDescription === "") {
        alert("Please enter a task description.");
        return;
    }

    // Construct the task data
    const taskData = {
        task_description: taskDescription,
        jha_id: jsonData.jha_id
    };

    // Call the API to add the task
    fetch(apiUrlTasks, {
        method: 'POST',
        body: JSON.stringify(taskData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Here you should have the task object returned by the API, including its ID
        const taskId = data.id;

        // Now you can create the task element with the stored ID
        const taskList = document.getElementById('tasks-container');
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.dataset.taskId = taskId; // Store the ID
        taskElement.innerHTML = `
            <div class="task-description">${taskDescription}</div>
            <div class="hazards-container"></div>
            <button type="button" class="button is-primary add-hazard-button" onclick="addHazard(this, ${taskId})">Add Hazard</button>
        `;
        taskList.appendChild(taskElement);
        
        // Clear the input
        taskDescriptionInput.value = '';
        
        // Optionally, show the submit button or enable it if necessary
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

    // const addConsequenceButton = hazardElement.querySelector('.add-consequence-button');
    // addConsequenceButton.addEventListener('click', function() {
    //     addConsequence(hazardElement, null);
    // });

    // const addPreventativeMeasureButton = hazardElement.querySelector('.add-preventative-measure-button');
    // addPreventativeMeasureButton.addEventListener('click', function() {
    //     addPreventativeMeasure(this);
    // });
}

function addConsequence(hazardElement, hazardId) {
    // Create a container for the consequence input and button
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
    submitConsequenceButton.classList.add('button', 'is-primary', 'submit-consequence-button', 'is-magenta');
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
    submitPreventativeMeasureButton.classList.add('button', 'is-primary', 'submit-preventative-measure-button', 'is-magenta');
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
const finishButton = document.getElementById('your-finish-button-id');
finishButton.textContent = 'Finish'; // Change the button text to 'Finish'
finishButton.addEventListener('click', function() {
    toggleModal();
    fetchJHA();
    // Here you can also add any other actions you need to perform when finishing
});
// Event listener for the 'Add New JHA' button
document.getElementById('show-modal').addEventListener('click', toggleModal);

// Function to submit the new JHA data
function submitJHA() {
    const form = document.getElementById('new-jha-form');
    const formData = new FormData(form);
    jsonData = Object.fromEntries(formData.entries());

    // Use apiUrl which is defined in your HTML template
    fetch(apiUrlJHA, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
            'Content-Type': 'application/json',
            // Include CSRF token header if needed
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("The title has already been used.");
        }
        return response.json();
    })
    .then(data => {
        // If the submission is successful, hide the JHA form and show the tasks form
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
            // Include CSRF token if needed for your setup
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tasks submitted successfully:', data);
        // Handle the successful submission, e.g., closing the modal or showing a success message
    })
    .catch(error => {
        console.error('Error submitting tasks:', error);
        // Handle errors here, such as showing an error message to the user
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

    const method = hazardId ? 'PUT' : 'POST'; // Use PUT to update and POST to create
    const endpoint = hazardId ? `${apiUrlHazard}/${hazardId}` : apiUrlHazard;

    // Call the API to add or update the hazard
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
    
        // Update the button event handlers to reference the hazardId from the dataset at the time of click
        const addConsequenceButton = hazardItem.querySelector('.add-consequence-button');
        addConsequenceButton.disabled = false;
        addConsequenceButton.addEventListener('click', function() {
            // Directly access the hazardId from the dataset here
            addConsequence(hazardItem, hazardItem.dataset.hazardId);
        });
    
        const addPreventativeMeasureButton = hazardItem.querySelector('.add-preventative-measure-button');
        addPreventativeMeasureButton.disabled = false;
        addPreventativeMeasureButton.addEventListener('click', function() {
            // Directly access the hazardId from the dataset here
            addPreventativeMeasure(hazardItem, hazardItem.dataset.hazardId);
        });
    
        // Update the button text now that the hazard has been saved
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

    const data = {
        description: description,
        job_hazard_analysis_task_hazard_id: hazardId
    };

    const method = consequenceId ? 'PUT' : 'POST';
    const endpoint = consequenceId ? `${apiUrlConsequences}/${consequenceId}` : apiUrlConsequences;

    fetch(endpoint, {
        method: method,
        body: JSON.stringify(data),
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
    const description = preventativeMeasureInput.value.trim();
    const preventativeMeasureId = preventativeMeasureElement.dataset.preventativeMeasureId;

    if (description === "") {
        alert("Please enter a preventative measure description.");
        return;
    }

    const data = {
        description: description,
        job_hazard_analysis_task_hazard_id: hazardId
    };

    const method = preventativeMeasureId ? 'PUT' : 'POST';
    const endpoint = preventativeMeasureId ? `${apiUrlPMs}/${preventativeMeasureId}` : apiUrlPMs;

    fetch(endpoint, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
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

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message; // Set the error message text
    errorMessageDiv.classList.remove('is-hidden'); // Show the error message

    // Hide the error message after 10 seconds
    setTimeout(() => {
        errorMessageDiv.classList.add('is-hidden');
    }, 10000); // 10000 milliseconds = 10 seconds
}

document.addEventListener('DOMContentLoaded', function() {
    fetchJHA();
});
