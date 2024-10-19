function updateClientDetail(clientId) {

    setDataToModalInputs(clientId)
    $('#updateObject').modal('show');


}

async function setDataToModalInputs(clientId) {
    try {
        const data = await getClientData(clientId);
        if (data) {
            $('#update_last_name').val(data["last_name"]);
            $('#update_first_name').val(data["first_name"]);
            $('#update_phone_number').val(data["phone_number_for_input"]);
            $('#update_date_of_birth').val(data["date_of_birth_for_input"]);
            $('#update_address').val(data["address"]);
            $('#update_workplace').val(data["workplace"]);
            $('#update_diagnosis').val(data["diagnosis"]);
            $('#update_exist_user_id').val(data["id"]);
        }
    } catch (error) {
        console.error('Error fetching client data:', error);
    }
}

function getClientData(clientId) {
    const reqUrl = `/clients/${clientId}/get/api/`;
    return $.ajax({
        url: reqUrl,
        type: 'GET'
    });
}

function updateClientRequest() {
    const firstForm = $("#update-user-form").serialize()
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
            $('#updateObject').modal('hide');
            $('.client-select-generator').val(null).trigger('change');
            console.log('Data saved successfully:', response.message);
        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("Mijoz yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}