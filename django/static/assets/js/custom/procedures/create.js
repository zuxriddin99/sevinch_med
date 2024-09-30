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
