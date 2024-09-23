$(document).ready(function () {
    let currentPage = 1;
    const limit = 1;  // Set limit for items per page
    const apiUrl = 'http://127.0.0.1:8000/clients/list/';  // Your API endpoint

    // Function to fetch data from the API
    function fetchData(page) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: { page: page, limit: limit },
            success: function (response) {
                populateTable(response.results);
                createPagination(response.page, response.total_pages);
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    // Function to populate the table with data
    function populateTable(data) {
        const tableBody = $('#data-table tbody');
        tableBody.empty();  // Clear any existing rows

        $.each(data, function (index, item) {
            const dateOfBirth = item.date_of_birth ? item.date_of_birth : 'N/A';
            const row = `<tr>
                <td>${item.id}</td>
                <td>${item.first_name}</td>
                <td>${item.last_name}</td>
                <td>${dateOfBirth}</td>
                <td>${item.address}</td>
            </tr>`;
            tableBody.append(row);
        });
    }

    // Function to create pagination controls
    function createPagination(currentPage, totalPages) {
        const paginationControls = $('#pagination-controls');
        paginationControls.empty();  // Clear existing pagination

        const maxVisiblePages = 5;  // How many page links to display at a time

        // Previous Button
        paginationControls.append(`<button ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage - 1}"> < </button>`);

        // Generate page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
            paginationControls.append(`<button class="pagination-btn" data-page="1">1</button>`);
            if (startPage > 2) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
        }

        // Create page number buttons dynamically
        for (let page = startPage; page <= endPage; page++) {
            paginationControls.append(`<button class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
            paginationControls.append(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
        }

        // Next Button
        paginationControls.append(`<button ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage + 1}"> > </button>`);

        // Add click event to all pagination buttons
        $('.pagination-btn').click(function () {
            const page = $(this).data('page');
            if (page) {
                fetchData(page);
            }
        });
    }

    // Initial fetch
    fetchData(currentPage);
});



// ---------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    let currentPage = 1;
    let limit = 1;  // Items per page
    const apiUrl = 'http://127.0.0.1:8000/clients/list/';  // Your API endpoint
    let searchTerm = '';  // Initialize search term

    // Function to fetch data from the API
    function fetchData(page, search = '') {
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
            }
        });
    }

    // Function to populate the table with data
    function populateTable(data) {
        const tableBody = $('#data-table tbody');
        tableBody.empty();  // Clear any existing rows

        $.each(data, function (index, item) {
            const dateOfBirth = item.date_of_birth ? item.date_of_birth : 'N/A';
            const row = `<tr>
                <td>${item.id}</td>
                <td>${item.first_name}</td>
                <td>${item.last_name}</td>
                <td>${dateOfBirth}</td>
                <td>${item.address}</td>
            </tr>`;
            tableBody.append(row);
        });
    }

    // Function to create pagination controls
    function createPagination(currentPage, totalPages) {
        const paginationControls = $('#pagination-controls');
        paginationControls.empty();  // Clear existing pagination

        const maxVisiblePages = 5;  // How many page links to display at a time

        // Previous Button
        paginationControls.append(`<button ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage - 1}"> < </button>`);

        // Generate page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
            paginationControls.append(`<button class="pagination-btn" data-page="1">1</button>`);
            if (startPage > 2) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
        }

        // Create page number buttons dynamically
        for (let page = startPage; page <= endPage; page++) {
            paginationControls.append(`<button class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
            paginationControls.append(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
        }

        // Next Button
        paginationControls.append(`<button ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage + 1}"> > </button>`);

        // Add click event to all pagination buttons
        $('.pagination-btn').click(function () {
            const page = $(this).data('page');
            if (page) {
                fetchData(page, searchTerm);  // Fetch data for the clicked page with search
            }
        });
    }

    // Event listener for the search button
    $('#search-btn').click(function () {
        console.log(92)
        searchTerm = $('#search-term').val();  // Get the search term
        currentPage = 1;  // Reset to the first page when searching
        fetchData(currentPage, searchTerm);  // Fetch data based on search term
    });

    // Initial fetch (without search)
    fetchData(currentPage);
});

// --------------------------------------------------------------------------------------

$(document).ready(function () {
    let currentPage = 1;
    let limit = 1;  // Items per page
    const apiUrl = 'http://127.0.0.1:8000/clients/list/';  // Your API endpoint
    let searchTerm = '';  // Initialize search term
    let debounceTimeout;  // For debouncing input

    // Function to fetch data from the API
    function fetchData(page, search = '') {
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
            }
        });
    }

    // Function to populate the table with data
    function populateTable(data) {
        const tableBody = $('#data-table tbody');
        tableBody.empty();  // Clear any existing rows

        $.each(data, function (index, item) {
            const dateOfBirth = item.date_of_birth ? item.date_of_birth : 'N/A';
            const row = `<tr>
                <td>${item.id}</td>
                <td>${item.first_name}</td>
                <td>${item.last_name}</td>
                <td>${dateOfBirth}</td>
                <td>${item.address}</td>
            </tr>`;
            tableBody.append(row);
        });
    }

    // Function to create pagination controls
    function createPagination(currentPage, totalPages) {
        const paginationControls = $('#pagination-controls');
        paginationControls.empty();  // Clear existing pagination

        const maxVisiblePages = 5;  // How many page links to display at a time

        // Previous Button
        paginationControls.append(`<button ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage - 1}"> < </button>`);

        // Generate page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
            paginationControls.append(`<button class="pagination-btn" data-page="1">1</button>`);
            if (startPage > 2) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
        }

        // Create page number buttons dynamically
        for (let page = startPage; page <= endPage; page++) {
            paginationControls.append(`<button class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationControls.append('<span>...</span>');  // Ellipsis for skipped pages
            }
            paginationControls.append(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
        }

        // Next Button
        paginationControls.append(`<button ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn" data-page="${currentPage + 1}"> > </button>`);

        // Add click event to all pagination buttons
        $('.pagination-btn').click(function () {
            const page = $(this).data('page');
            if (page) {
                fetchData(page, searchTerm);  // Fetch data for the clicked page with search
            }
        });
    }

    // Function to debounce user input (wait for the user to stop typing)
    function debounce(fn, delay) {
        return function () {
            const args = arguments;
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    // Event listener for the search input field
    $('#search-term').on('input', debounce(function () {
        searchTerm = $(this).val();  // Get the search term
        currentPage = 1;  // Reset to the first page when searching
        fetchData(currentPage, searchTerm);  // Fetch data based on search term
    }, 500));  // Set debounce delay to 500ms

    // Initial fetch (without search)
    fetchData(currentPage);
});

