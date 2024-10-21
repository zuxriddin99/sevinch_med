$(document).ready(function () {
    let currentPage = 1;
    let limit = 20;  // Items per page
    const apiUrl = "list/api/";  // Your API endpoint
    console.log(apiUrl)
    let searchTerm = '';  // Initialize search term
    let startDate = '';  // Initialize search term
    let endDate = '';  // Initialize search term
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
    function fetchData(page, search = '', startDate = null, endDate = null) {
        showLoader();  // Show loader before sending the request
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: {
                page: page,
                limit: limit,
                search: search,  // Include search query in the request
                start_date: startDate,  // Include search query in the request
                end_date: endDate,  // Include search query in the request
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
            const dateOfBirth = item.date_of_birth ? item.date_of_birth : 'N/A';
            const row = `
                        <tr class="btn-reveal-trigger">
                            <td class="align-middle white-space-nowrap py-2"><span class="badge fs-10 w-100 badge-subtle-info">${item.id}</span></td>
                            <td class="name align-middle white-space-nowrap py-2"><a style="cursor: pointer" onclick="setDataToModalInputs(${item.id})">
                                <div class="d-flex d-flex align-items-center">
                                    <div class="avatar avatar-xl me-2">
                                        <div class="avatar-name rounded-circle"><span>${item.trunc_name}</span></div>
                                    </div>
                                    <div class="flex-1">
                                        <h5 class="mb-0 fs-10">${item.full_name}</h5>
                                    </div>
                                </div>
                            </a></td>
                            <td class="phone align-middle white-space-nowrap py-2"><a href="tel:${item.phone_number}">${item.phone_number}</a></td>
                            <td class="align-middle white-space-nowrap py-2">${item.additional_information}</td>
                            <td class="address align-middle white-space-nowrap py-2">${item.unpaid_invited_people}</td>
                            <td class="joined align-middle py-2">${item.total_invited_people}</td>
                            <td class="align-middle white-space-nowrap text-end">
                        <div class="dropstart font-sans-serif position-static d-inline-block">
                        <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end" type="button" id="" onclick="setReferralDataToInput(${item.id})"><span class="bi-cash-stack fs-10"></span></button>
                        </div>
                      </td>
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

    // Event listener for the search input field
    $('#timepicker3').on('input', debounce(function () {
        const datasList = $(this).val().split(" ")
        if (datasList.length === 1) {
            startDate = datasList[0]
        } else if (datasList.length === 2) {
            startDate = datasList[0]
            endDate = datasList[1]
        }
        currentPage = 1;  // Reset to the first page when searching
        fetchData(currentPage, searchTerm, startDate, endDate);  // Fetch data based on search term
    }, 500));  // Set debounce delay to 500ms

    // Initial fetch (without search)
    fetchData(currentPage);
});
$(document).ready(function () {
    $('#submit-btn').click(function () {
        const fullName = $('#full-name').val();
        const phoneNumber = $('#phone-number').val();
        const additionalInformation = $('#additional-information').val();

        const alert = `<div class="alert alert-danger border-0 d-flex align-items-center" role="alert" style="font-size: 14px"><p class="mb-0 flex-1">Ism va familiya Maydonini to'ldirish shart.</p><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        // Front-end validation
        if (fullName.trim() === '') {
            $('#response-message').html(alert);
            return;  // Do not proceed with AJAX request
        }

        $.ajax({
            url: createObjectUrl,
            type: "POST",
            contentType: "application/json",  // Set content type to JSON
            data: JSON.stringify({
                full_name: fullName,
                phone_number: phoneNumber,
                additional_information: additionalInformation,
            }),
            headers: {
                'X-CSRFToken': csrfToken  // Set CSRF token in headers (important for JSON requests)
            },
            success: function (response) {
                location.reload();
                $('#response-message').html(response.message);
            },
            error: function (xhr, status, error) {
                $('#response-message').html('Error: ' + xhr.responseText);
            }
        });
    });
});