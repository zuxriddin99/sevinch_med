$(document).ready(function () {
    let currentPage = 1;

    // Your API endpoint
    let searchTerm = '';  // Initialize search term


    // Event listener for the search input field
    $('#search-term').on('input', debounce(function () {
        searchTerm = $(this).val();  // Get the search term
        currentPage = 1;  // Reset to the first page when searching
        fetchData(currentPage, searchTerm);  // Fetch data based on search term
    }, 500));  // Set debounce delay to 500ms

    // Initial fetch (without search)
    fetchData(currentPage);
});

// Function to show loader
function showLoader() {
    $('#loader').show();
}

// Function to hide loader
function hideLoader() {
    $('#loader').hide();
}

// Function to fetch data from the API
function fetchData(page = 1, search = '') {
    showLoader();  // Show loader before sending the request
    const apiUrl = getTransfersListUrl;
    let limit = 20;  // Items per page

    $.ajax({
        url: apiUrl,
        type: 'GET',
        data: {
            page: page,
            limit: limit,
            search: search  // Include search query in the request
        },
        success: function (response) {
            populateTable(response.results);
            createPagination(response.page, response.total_pages);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        },
        complete: function () {
            hideLoader();  // Hide loader when the request is complete
        }
    });
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = $('#data-table tbody');
    tableBody.empty();  // Clear any existing rows

    $.each(data, function (index, item) {
        let transferType = `<span class="badge rounded-pill d-block badge-subtle-success fs-10">Kirim<span class="ms-1 fas fas fa-sort-numeric-down" data-fa-transform="shrink-2"></span></span>`
        let description = item.description
        if(item.transfer_type === 'expense'){
            transferType = `<span class="badge rounded-pill d-block badge-subtle-warning fs-10">Chiqim<span class="ms-1 fas fas fa-sort-numeric-up" data-fa-transform="shrink-2"></span></span>`
        }
        if (item.procedure){
            description = `<a target="_blank" href="/procedures/${item.procedure}/update/">#${item.procedure} - muolaja uchun qilingan to'lov</a>`
        }
        const row = `
                        <tr class="btn-reveal-trigger">
                            <td class="align-middle  py-2"><span class="badge rounded-pill fs-10 w-100 badge-subtle-info">${item.id}</span></td>
                            <td class="py-2 align-middle text-center fs-9 ">${transferType}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${item.get_transfer_method_display}</td>
                            <td class="py-2 align-middle text-end fs-9 fw-medium">${formatCurrency(item.amount)}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${item.translated_created_at}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${description}</td>
                        </tr>
                        `;
        tableBody.append(row);
    });
    hideLoader();  // Hide loader when the request is complete
}


// Function to create pagination controls
function createPagination(currentPage, totalPages) {
    const paginationControls = $('#pagination-controls');
    paginationControls.empty();  // Clear existing pagination


    const maxVisiblePages = 5;  // How many page links to display at a time

    // Previous Button
    paginationControls.append(`<button title="Previous" ${currentPage === 1 ? 'disabled' : ''} class="btn btn-sm btn-falcon-default me-1 pagination-btn" data-page="${currentPage - 1}"> <span class="fas fa-chevron-left"></span> </button>`);

    // Generate page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    paginationControls.append(`<ul id="pagination-number-controls" class="pagination mb-0"></ul>`)
    const paginationNumberControls = $('#pagination-number-controls');
    paginationNumberControls.empty();  // Clear existing pagination
    if (startPage > 1) {
        paginationNumberControls.append(`<li><button class="pagination-btn page" data-page="1">1</button></li>`);
        if (startPage > 2) {
            paginationNumberControls.append('<li><span> . . . </span></li>');  // Ellipsis for skipped pages
        }
    }

    // Create page number buttons dynamically
    for (let page = startPage; page <= endPage; page++) {
        paginationNumberControls.append(`<li class="${page === currentPage ? 'active' : ''}"><button class="pagination-btn page" data-page="${page}">${page}</button></li>`);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationNumberControls.append('<li><span> . . . </span></li>');  // Ellipsis for skipped pages
        }
        paginationNumberControls.append(`<li><button class="pagination-btn page" data-page="${totalPages}">${totalPages}</button></li>`);
    }

    // Next Button
    paginationControls.append(`<button ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn btn btn-sm btn-falcon-default ms-1" title="Next" data-page="${currentPage + 1}">  <span class="fas fa-chevron-right"></span> </button>`);

    // Add click event to all pagination buttons
    $('.pagination-btn').click(function () {
        const page = $(this).data('page');
        let searchTerm = ''
        if (page) {
            fetchData(page, searchTerm);  // Fetch data for the clicked page with search
        }
    });
}

// Function to debounce user input (wait for the user to stop typing)
function debounce(fn, delay) {
    let debounceTimeout;  // For debouncing input
    return function () {
        const args = arguments;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
