$(document).ready(function () {
    // Initial fetch (without search)
    fetchData();
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
function fetchData(startDate = null, endDate = null) {
    showLoader();  // Show loader before sending the request
    let limit = 20;  // Items per page

    $.ajax({
        url: getStatisticListUrl,
        type: 'GET',
        data: {
            start_date: startDate,
            end_date: endDate,
        },
        success: function (response) {
            populateTable(response);
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
    let datasList = $('#timepicker3').val().split(" ")
    let startDate = null
    let endDate = null
    if (datasList.length === 1) {
        startDate = datasList[0]
    } else if (datasList.length === 2) {
        startDate = datasList[0]
        endDate = datasList[1]
    }
    fetchData(startDate, endDate)
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = $('#data-table tbody');
    const statisticMessageDiv = $('#statisticMessageDiv');

    statisticMessageDiv.empty()
    statisticMessageDiv.append(`<h5 class="fs-9 mb-0 text-nowrap py-2 py-xl-0">${data.message}</h5>`)
    tableBody.empty();  // Clear any existing rows
    console.log(data.result)
    $.each(data.result, function (index, item) {
        const row = `
                        <tr class="btn-reveal-trigger">
                            <td class="py-2 align-middle text-center fs-9 "><span class="badge rounded-pill fs-10 w-100 badge-subtle-info">${item.received_dt}</span></td>
                            <td class="py-2 align-middle text-center fs-9 ">${item._1_3_treatment}</td>
                            <td class="py-2 align-middle text-center fs-9">${item._4_5_treatment}</td>
                            <td class="py-2 align-middle text-center fs-9">${item._6_10_treatment}</td>
                            <td class="py-2 align-middle text-center fs-9">${formatCurrency(item.cash)}</td>
                            <td class="py-2 align-middle text-center fs-9">${formatCurrency(item.card)}</td>
                            <td class="py-2 align-middle text-center fs-9">${formatCurrency(item.transfer_to_card)}</td>
                            <td class="py-2 align-middle text-center fs-9">${item.drug}</td>
                            <td class="py-2 align-middle text-center fs-9">${item.adapter}</td>
                        </tr>
                        `;
        tableBody.append(row);
    });


    setSumResult(data.result)

    hideLoader();  // Hide loader when the request is complete
}

function setSumResult(data) {
    const totalInfoTr = $('#totalInfoTr');
    totalInfoTr.empty()
    if (!data || data.length === 0) {
        totalInfoTr.append(`<th class="no-sort pe-1 align-middle white-space-nowrap text-center fs-8" colspan="9"><u>Quyidagi sana bo'yicha ma'lumot topilmadi</u></th>`)
    } else {
        const sumFields = (data) => {
            return data.reduce((acc, obj) => {
                Object.keys(obj).forEach(key => {
                    if (key !== 'received_dt') {
                        acc[key] = (acc[key] || 0) + obj[key];
                    }
                });
                return acc;
            }, {});
        };
        const total = sumFields(data);

        totalInfoTr.append(`<th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>Umumiy -></u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${total._1_3_treatment}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${total._4_5_treatment}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${total._6_10_treatment}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${formatCurrency(total.cash)}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${formatCurrency(total.card)}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${formatCurrency(total.transfer_to_card)}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${total.drug}</u></th>
                        <th class="no-sort pe-1 align-middle white-space-nowrap text-center"><u>${total.adapter}</th</u>>`)
    }
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
