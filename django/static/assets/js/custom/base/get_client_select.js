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

$('.client-select-generator').select2({
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
    dropdownParent: $('#createObject'),
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
    $('.client-select-generator').val(null).trigger('change');
});
