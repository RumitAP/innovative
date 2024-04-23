function formatArrayOrObject(data) {
    if (Array.isArray(data)) {
        return data.join(', ');
    } else if (data && typeof data === 'object') {
        return data.name || data.description || JSON.stringify(data);
    }
    return 'N/A';
}

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove('is-hidden'); 

    setTimeout(() => {
        errorMessageDiv.classList.add('is-hidden');
    }, 10000); 
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