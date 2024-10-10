// Button click event to clear the selection
$('#clear_referral').on('click', function () {
    $('.js-data-referral-persons').val(null).trigger('change');
});

// Button click event to clear the selection
$('#clear-procedure-type').on('click', function () {
    $('.js-data-procedure-types').val(null).trigger('change');
});

$('.js-data-referral-persons').select2({
    ajax: {

        url: getReferralsListUrl,  // Replace with the actual API URL
        dataType: 'json',
        delay: 250,  // Add a delay to prevent overwhelming the server with requests
        data: function (params) {
            return {
                search: params.term,  // search term
                page: params.page || 1,  // pagination
                limit: 10  // results per page
            };
        }, processResults: function (data, params) {
            params.page = params.page || 1;

            return {
                results: data.results.map(function (item) {
                    return {
                        id: item.id,
                        full_name: item.full_name,
                    };
                }), pagination: {
                    more: data.page < data.total_pages  // Enable pagination if more pages are available
                }
            };
        },
        cache: true
    },
    minimumInputLength: 1,  // Minimum characters to trigger the search
    templateResult: formatReferralOption,  // Custom format for result items
    templateSelection: formatReferralSelection,  // Custom format for selected items
    placeholder: 'Select an option',
    dropdownParent: $('#createObject'),
    language: {
        inputTooShort: function () {
            return "Mijozni ismi, familyasi yoki id raqami bo'yicha izlash";  // Custom message
        },
        noResults: function () {
            return "Ma'lumot topilmadi";  // Custom message
        },

    }
});

function formatReferralOption(user) {
    if (!user.id) {
        return user.full_name;  // Display the default text if no user
    }
    return $(`<div style="display: flex; align-items: center;">
            <div style="flex-grow: 1;">
                <strong style="color: #ff0062;">№ ${user.id} <span style="color: #30eb03">||</span> ${user.full_name}</strong>
            </div>
            <div style="margin-left: auto; background-color: #eee; padding: 5px; border-radius: 4px;">
            </div>
        </div>`);
}

// Function to display formatted selection
function formatReferralSelection(user) {
    if (user.id === "") {
        return "Hamkor shifokorni tanlash."
    }
    return `${user.id} || ${user.full_name}` || user.id;
}

$('.js-data-procedure-types').select2({
    ajax: {

        url: getProcedureTypeList,  // Replace with the actual API URL
        dataType: 'json',
        delay: 250,  // Add a delay to prevent overwhelming the server with requests
        data: function (params) {
            return {
                search: params.term,  // search term
                page: params.page || 1,  // pagination
                limit: 10  // results per page
            };
        }, processResults: function (data, params) {
            params.page = params.page || 1;

            return {
                results: data.results.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                }), pagination: {
                    more: data.page < data.total_pages  // Enable pagination if more pages are available
                }
            };
        },
        cache: true
    },
    minimumInputLength: 1,  // Minimum characters to trigger the search
    templateResult: formatProcedureTypeOption,  // Custom format for result items
    templateSelection: formatProcedureTypeSelection,  // Custom format for selected items
    placeholder: 'Select an option',
    dropdownParent: $('#createObject'),
    language: {
        inputTooShort: function () {
            return "Muolaja nomi bo'yicha izlash";  // Custom message
        },
        noResults: function () {
            return "Ma'lumot topilmadi";  // Custom message
        },

    }
});

function formatProcedureTypeOption(option) {
    if (!option.id) {
        return option.name;  // Display the default text if no user
    }
    return $(`<div style="display: flex; align-items: center;">
            <div style="flex-grow: 1;">
                <strong style="color: #ff0062;">${option.name}</strong>
            </div>
            <div style="margin-left: auto; background-color: #eee; padding: 5px; border-radius: 4px;">
            </div>
        </div>`);
}

// Function to display formatted selection
function formatProcedureTypeSelection(option) {
    if (option.id === "") {
        return "Muolaja turini tanlash."
    }
    return `${option.name}` || option.id;
}

function getBillingData() {
    const treatmentsCount = $("#number_of_recommended_treatments").val() || 0
    const discount = removeSpacesFromNumber($("#discount-input").val()) || 0
    const cashPay = removeSpacesFromNumber($("#cash-pay").val()) || 0
    const cardPay = removeSpacesFromNumber($("#card-pay").val()) || 0
    const cardTransferPay = removeSpacesFromNumber($("#card-transfer-pay").val()) || 0
    const paid = cashPay + cardPay + cardTransferPay
    const apiUrl = `${getBillingDataUrl}?treatments_count=${treatmentsCount}&discount=${discount}&paid=${paid}`
    console.log(discount)
    // Fetch data from API
    $.getJSON(apiUrl, function (response) {
        // Clear table body and footers
        const tableBody = $('#payment-table');
        tableBody.empty();  // Clear any existing rows
        // Loop through the data and append rows
        $.each(response.data, function (index, item) {
            const row = `<tr class="border-200">
                                <td class="align-middle">
                                    <h6 class="mb-0 text-nowrap">${item.name}</h6>
                                </td>
                                <td class="align-middle text-end">${formatCurrency(item.price)}</td>
                             </tr>`

            tableBody.append(row);
        });
        // Set the footer values using formatted prices
        $("#total-price").text(formatCurrency(response.total_price));
        $("#billing-discount").text(formatCurrency(response.discount));
        $("#paid").text(formatCurrency(response.paid));
        $("#need-paid").text(formatCurrency(response.need_paid));
        $("#need-paid-hidden").val(response.need_paid);
    }).fail(function () {
        alert("Failed to fetch data from the API");
    });
}

function switchTab(tabIndex) {
    $('.tab-pane').removeClass('active'); // Hide all tabs
    $('#form-wizard-progress-tab' + tabIndex).addClass('active'); // Show the selected tab

    $('.nav-link').removeClass('active'); // Hide all tabs
    $('#navbar-button-' + tabIndex).addClass('active'); // Show the selected tab


}

function changeTab(numberTab) {
    switchTab(numberTab);
}

function saveProcedure() {
    const firstForm = $("#first-form").serialize()
    const secondForm = $("#second-form").serialize()
    const thirdForm = $("#third-form").serialize()
    if (!isValid()) {
        return
    }
    let allData = firstForm + '&' + secondForm + '&' + thirdForm;
    console.log(allData)
    $.ajax({
        url: createProcedureUrl,
        type: 'POST',
        data: allData,
        headers: {
            'X-CSRFToken': csrfToken  // Set CSRF token in headers (important for JSON requests)
        },
        success: function (response) {
            // Handle success response from the API
            console.log('Data saved successfully:', response.message);
            if (response.is_created) {

                window.open(response.url, '_blank');
                window.location.reload();
            } else {
                const e = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
                                        Bu mijozda tugallanmagan muolaja mavjud oldin uni tugating.
                                       <a class="icon-link" target="_blank" href="${response.url}">
                                            <span class="bi fas fa-link"></span>
                                            Muolajaga o'tish
                                        </a>
                        <button class="btn-close" type="button" data-bs-dismiss="alert"
                                aria-label="Close"></button>
                    </div>`
                const errorDiv = $("#errorDiv")
                errorDiv.empty();
                errorDiv.append(e);
            }
        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("Muolaja yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}

function isValid() {
    const firstName = $("#first_name").val();
    const lastName = $("#last_name").val();
    const procedureType = $("#procedure-type-select").val();
    const needPaidHidden = Number($("#need-paid-hidden").val());
    const errorDiv = $("#errorDiv")
    let hasError = false
    let row = ""
    if (!firstName) {
        row += "<strong> - Mijozni Ismi</strong> maydonini to'ldirish shart.<br>"
        hasError = true
    }
    if (!lastName) {
        row += "<strong> - Mijozni Familyasi</strong> maydonini to'ldirish shart.<br>"
        hasError = true
    }
    if (!procedureType) {
        row += "<strong> - Muolaja turi</strong> maydonini to'ldirish shart.<br>"
        hasError = true
    }
    if (needPaidHidden < 0) {
        row += " - To'lovlar yoki chegirma noto'gri kiritilgan.<br>"
        hasError = true
    }
    if (hasError) {
        const e = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                       ${row}
                        <button class="btn-close" type="button" data-bs-dismiss="alert"
                                aria-label="Close"></button>
                    </div>`
        errorDiv.empty();
        errorDiv.append(e);
        return false
    }
    return true
}
