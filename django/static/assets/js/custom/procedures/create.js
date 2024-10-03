function update_diagnosis_height() {
    const textarea = document.getElementById('diagnosis');
    textarea.style.height = 10 + "px";
    textarea.style.height = textarea.scrollHeight + 50 + "px";
}

function set_user_information(selectedData) {
    $('#first_name').val(selectedData.first_name);
    $('#last_name').val(selectedData.last_name);
    $('#phone_number').val(selectedData.phone_number);
    $('#date_of_birth').val(selectedData.date_of_birth);
    $('#address').val(selectedData.address);
    $('#workplace').val(selectedData.workplace);
    $('#diagnosis').val(selectedData.diagnosis);
}

// Function to display formatted result items
function formatUser(user) {
    if (!user.id) {
        return user.first_name;  // Display the default text if no user
    }
    return $(`<div style="display: flex; align-items: center;">
            <div style="flex-grow: 1;">
                <strong style="color: #ff0062;">№ ${user.id} <span style="color: #30eb03">||</span> ${user.first_name} ${user.last_name} <span style="color: #30eb03">||</span> ${user.phone_number} <span style="color: #30eb03">||</span>  ${user.date_of_birth}</strong> <br/>
                <small style="color: #6c757d;"><span style="color: #13aefb">Ma'nzil:</span> ${user.address}</small>
            </div>
            <div style="margin-left: auto; background-color: #eee; padding: 5px; border-radius: 4px;">
            </div>
        </div>`);
}

// Function to display formatted selection
function formatUserSelection(user) {
    if (user.id === "") {
        let d = {
            id: "",
            first_name: "",
            last_name: "",
            date_of_birth: "",
            address: "",
            created_at: "",
            trunc_name: "",
            phone_number: "",
            workplace: "",
            diagnosis: "",
        }
        set_user_information(d)
        update_diagnosis_height()
        return "Mijozni tanlash"
    }
    set_user_information(user)
    update_diagnosis_height()
    return `${user.id} || ${user.first_name} ${user.last_name}` || user.id;
}

$('.js-data-example-ajax').select2({
    ajax: {

        url: getClientListUrl,  // Replace with the actual API URL
        dataType: 'json', delay: 250,  // Add a delay to prevent overwhelming the server with requests
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
                        first_name: item.first_name,
                        last_name: item.last_name,
                        date_of_birth: item.date_of_birth_for_input,
                        address: item.address,
                        created_at: item.created_at,
                        trunc_name: item.trunc_name,
                        phone_number: item.phone_number_for_input,
                        workplace: item.workplace,
                        diagnosis: item.diagnosis,
                    };
                }), pagination: {
                    more: data.page < data.total_pages  // Enable pagination if more pages are available
                }
            };
        },
        cache: true
    },
    minimumInputLength: 1,  // Minimum characters to trigger the search
    templateResult: formatUser,  // Custom format for result items
    templateSelection: formatUserSelection,  // Custom format for selected items
    dropdownParent: $('#createProcedure'),
    placeholder: 'Select an option',
    scrollAfterSelect: true,
    language: {
        inputTooShort: function () {
            return "Mijozni ismi, familyasi yoki id raqami bo'yicha izlash";  // Custom message
        },
        noResults: function () {
            return "Ma'lumot topilmadi";  // Custom message
        },

    }
});
// Button click event to clear the selection
$('#clear_client').on('click', function () {
    $('.js-data-example-ajax').val(null).trigger('change');
});

// Button click event to clear the selection
$('#clear_referral').on('click', function () {
    $('.js-data-referral-persons').val(null).trigger('change');
});


// Button click event to clear the selection
$('#clear-procedure-type').on('click', function () {
    $('.js-data-procedure-types').val(null).trigger('change');
});


document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#date_of_birth", {
        maxDate: "today", // Customize month names (in Uzbek or any other language)
        locale: {
            firstDayOfWeek: 1,  // Set Monday as the first day of the week
            months: {
                shorthand: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
                longhand: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
            }, weekdays: {
                shorthand: ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha",],  // Uzbek short weekday names
                longhand: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba",]
            }
        },

        // Format for displaying the date
        dateFormat: "d/m/Y"  // Day/Month/Year format
    });
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
    dropdownParent: $('#createProcedure'),
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
    dropdownParent: $('#createProcedure'),
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

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

function removeSpacesFromNumber(numberStr) {
    return Number(numberStr.replace(/\s+/g, ''));
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
        success: function(response) {
            // Handle success response from the API
            console.log('Data saved successfully:', response.message);
            alert(response.message);
            if (response.is_created){
                location.reload();
            }
        },
        error: function(xhr, status, error) {
            // Handle error response from the API
            alert("Muolaja yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}

function isValid() {
    const firstName = $("#first_name").val();
    const lastName = $("#last_name").val();
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
