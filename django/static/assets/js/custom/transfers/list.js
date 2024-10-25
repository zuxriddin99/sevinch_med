$(document).ready(function () {
    let currentPage = 1;

    // Initial fetch (without search)
    fetchData(currentPage, false);
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
function fetchData(page = 1, getStatistic = true, transferMethod = null, transferType = null, startDate = null, endDate = null) {
    showLoader();  // Show loader before sending the request
    let limit = 20;  // Items per page

    $.ajax({
        url: getTransfersListUrl,
        type: 'GET',
        data: {
            page: page,
            limit: limit,
            transfer_method: transferMethod,
            transfer_type: transferType,
            start_date: startDate,
            end_date: endDate,
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
    if (getStatistic) {
        getTotalIncomeExpense(transferMethod, transferType, startDate, endDate)
    }
}

function getTotalIncomeExpense(transferMethod = null, transferType = null, startDate = null, endDate = null) {

    $.ajax({
        url: getStatisticUrl,
        type: 'GET',
        data: {
            transfer_method: transferMethod,
            transfer_type: transferType,
            start_date: startDate,
            end_date: endDate,
        },
        success: function (response) {
            console.log(response)
            const statisticDiv = $('#statisticDiv')
            statisticDiv.empty()
            statisticDiv.append(
                `<h4 class="mb-1 font-sans-serif">
                     <span class="fw-normal text-600">Kirim:</span>
                     <span class="text-700 mx-2" data-countup='{"endValue":"0"}'>${formatCurrency(response.income_total)}</span>
                 </h4>
                 <p class="fs-10 fw-semi-bold mb-0"><span class="text-600 fw-normal">Chiqim:</span>${response.expense_total} so'm</p>`
            )
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        },
        complete: function () {
            hideLoader();  // Hide loader when the request is complete
        }
    });
}

function useFilter() {
    let transferMethod = $('#transfer_method').val()
    let transferType = $('#transfer_type').val()
    let datasList = $('#timepicker3').val().split(" ")
    let startDate = null
    let endDate = null
    if (transferMethod === "null") {
        transferMethod = null
    }
    if (transferType === "null") {
        transferType = null
    }
    if (datasList.length === 1) {
        startDate = datasList[0]
    } else if (datasList.length === 2) {
        startDate = datasList[0]
        endDate = datasList[1]
    }
    fetchData(1, true, transferMethod, transferType, startDate, endDate)
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = $('#data-table tbody');
    tableBody.empty();  // Clear any existing rows

    $.each(data, function (index, item) {
        let transferType = `<span class="badge rounded-pill badge-subtle-success fs-10">Kirim<span class="ms-1 fas fas fa-sort-numeric-down" data-fa-transform="shrink-2"></span></span>`
        let description = item.description
        if (item.transfer_type === 'expense') {
            transferType = `<span class="badge rounded-pill badge-subtle-warning fs-10">Chiqim<span class="ms-1 fas fas fa-sort-numeric-up" data-fa-transform="shrink-2"></span></span>`
        }
        if (item.procedure) {
            description = `<a target="_blank" href="/procedures/${item.procedure}/update/">${item.procedure_full_name}</a>`
        }
        const row = `
                        <tr class="btn-reveal-trigger">
                            <td class="py-2 align-middle text-center fs-9 ">${description}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${transferType}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${item.get_transfer_method_display}</td>
                            <td class="py-2 align-middle text-end fs-9 fw-medium">${formatCurrency(item.amount)}</td>
                            <td class="py-2 align-middle text-center fs-9 ">${item.translated_created_at}</td>
                            
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
            fetchData(page, false);  // Fetch data for the clicked page with search
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
