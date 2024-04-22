let currentPage = 1;

function fetchJHA(page = 1) {
    // Correct the query parameter for page number
    fetch(`${apiUrl}?page=${page}`)
        .then(response => response.json())
        .then(data => {
            currentPage = data.pagination.current_page;
            const totalPages = data.pagination.total_pages;
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

function updatePagination(totalPages) {
    const paginationList = document.getElementById('pagination-list');
    paginationList.innerHTML = ''; // Clear existing pagination buttons
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = `<li><a class="pagination-link ${page === currentPage ? 'is-current' : ''}" aria-label="Goto page ${page}" onclick="fetchJHA(${page})">${page}</a></li>`;
        paginationList.innerHTML += pageItem;
    }
}

function toggleModal() {
    var modal = document.getElementById('new-jha-modal');
    modal.classList.toggle('is-active');
}

// Event listener for the 'Add New JHA' button
document.getElementById('show-modal').addEventListener('click', toggleModal);

// Function to submit the new JHA data
function submitJHA() {
    const form = document.getElementById('new-jha-form');
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    // Use apiUrl which is defined in your HTML template
    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
            'Content-Type': 'application/json',
            // Include CSRF token header if needed
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.error);
        }
        return response.json();
    })
    .then(data => {
        // handle success
    })
    .catch((error) => {
        console.error('Error:', error);
        displayErrorMessage(error.message);
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
