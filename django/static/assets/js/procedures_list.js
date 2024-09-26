$(document).ready(function () {
    let currentPage = 1;
    let limit = 20;  // Items per page
    const apiUrl = "list/api/";  // Your API endpoint
    console.log(apiUrl)
    let searchTerm = '';  // Initialize search term
    let debounceTimeout;  // For debouncing input

    // Function to show loader
    function showLoader() {
        $('#loader').show();
    }

    // Function to hide loader
    function hideLoader() {
        $('#loader').hide();
    }

    // Function to fetch data from the API
    function fetchData(page, search = '') {
        showLoader();  // Show loader before sending the request
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
            const was_completed = `<span class="badge badge rounded-pill d-block badge-subtle-success">Tugallangan <svg class="svg-inline--fa fa-check fa-w-16 ms-1" data-fa-transform="shrink-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style="transform-origin: 0.5em 0.5em;"><g transform="translate(256 256)"><g transform="translate(0, 0)  scale(0.875, 0.875)  rotate(0 0 0)"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" transform="translate(-256 -256)"></path></g></g></svg></span>`
            const was_uncompleted = `<span class="badge badge rounded-pill d-block badge-subtle-warning">Tugallanmagan <svg class="svg-inline--fa fa-stream fa-w-16 ms-1" data-fa-transform="shrink-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stream" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style="transform-origin: 0.5em 0.5em;"><g transform="translate(256 256)"><g transform="translate(0, 0)  scale(0.875, 0.875)  rotate(0 0 0)"><path fill="currentColor" d="M16 128h416c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H16C7.16 32 0 39.16 0 48v64c0 8.84 7.16 16 16 16zm480 80H80c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm-64 176H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16z" transform="translate(-256 -256)"></path></g></g></svg></span>`
            if (item.was_completed) {
                var completed_status = was_completed
            } else {
                var completed_status = was_uncompleted
            }
            const row = `
                        <tr class="btn-reveal-trigger">
                            <td class="align-middle white-space-nowrap py-2"><span class="badge fs-10 w-100 badge-subtle-info">${item.id}</span></td>
                            <td class="name align-middle white-space-nowrap py-2"><a href="customer-details.html">
                                <div class="d-flex d-flex align-items-center">
                                    <div class="avatar avatar-xl me-2">
                                        <div class="avatar-name rounded-circle"><span>${item.client.trunc_name}</span></div>
                                    </div>
                                    <div class="flex-1">
                                        <h5 class="mb-0 fs-10">${item.client.last_name} ${item.client.first_name}</h5>
                                    </div>
                                </div>
                            </a></td>
                            <td class="align-middle white-space-nowrap py-2"><a href="tel:${item.client.phone_number}">${item.client.phone_number}</a></td>
                            <td class="align-middle white-space-nowrap py-2">${item.procedure_type_name}</td>
                            <td class="align-middle white-space-nowrap py-2">${item.number_of_recommended_treatments}</td>
                            <td class="align-middle white-space-nowrap py-2">${item.items_count}</td>
                            <td class="align-middle white-space-nowrap py-2">${item.created_at}</td>
                            <td class="status py-2 align-middle text-center fs-9 white-space-nowrap" >${completed_status}</td>
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
