async function setDataToModalInputs(referralId) {
    try {
        const data = await getReferralData(referralId);
        console.log(data)
        if (data) {
            $('#hidden-referral-id').val(data["id"]);
            $('#update-full-name').val(data["full_name"]);
            $('#update-phone-number').val(data["phone_number"]);
            $('#update-additional-information').val(data["additional_information"]);
            $('#updateObject').modal('show');
        }
    } catch (error) {
        console.error('Error fetching client data:', error);
    }
}

function getReferralData(referralId) {
    const reqUrl = `/referrals/${referralId}/get/api/`;
    return $.ajax({
        url: reqUrl,
        type: 'GET'
    });
}

function updateReferralRequest() {
    const referralId = $("#hidden-referral-id").val()
    const fullName = $('#update-full-name').val();
    const phoneNumber = $('#update-phone-number').val();
    const additionalInformation = $('#update-additional-information').val();
    console.log(referralId)
    $.ajax({
        url: `${referralId}/update/api/`,
        type: 'PATCH',
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
            // Handle success response from the API
            const alertDiv = $("#alertDiv");
            alertDiv.empty();
            alertDiv.append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${response.message}
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                        `)

            $('#updateObject').modal('hide');
            location.reload()
        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("Mijoz yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}