function createClient() {
    const firstForm = $("#first-form").serialize()
    if (!isValid()) {
        return
    }
    console.log(firstForm)
    $.ajax({
        url: createClientUrl,
        type: 'POST',
        data: firstForm,
        headers: {
            'X-CSRFToken': csrfToken  // Set CSRF token in headers (important for JSON requests)
        },
        success: function (response) {
            // Handle success response from the API
            const alertDiv = $("#alertDiv");
            alertDiv.empty();
            alertDiv.append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${response.message}
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                        `)
            fetchData(1)
            $('#createObject').modal('hide');
            $('.client-select-generator').val(null).trigger('change');
            console.log('Data saved successfully:', response.message);

        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("Mijoz yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}

function isValid() {
    const firstName = $("#first_name").val();
    const lastName = $("#last_name").val();
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
