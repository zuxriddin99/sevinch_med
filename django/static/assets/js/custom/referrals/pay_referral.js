async function setReferralDataToInput(referralId) {
    try {
        const data = await getReferralData(referralId);
        if (data) {
            $('#info-hidden-referral-id').val(data["id"]);
            $('#unpaid_referrals').val(data["unpaid_referrals"]);
            $('#paid_referrals').val(data["paid_referrals"]);
            $('#total_referrals').val(data["all_referrals"]);
            $('#referralPersonName').val(data["full_name"]);
            $('#pay').attr('max', data["unpaid_referrals"]);
            $('#payObject').modal('show');
        }
    } catch (error) {
        console.error('Error fetching client data:', error);
    }
}

function getReferralData(referralId) {
    const reqUrl = `/referrals/${referralId}/info/api/`;
    return $.ajax({
        url: reqUrl,
        type: 'GET'
    });
}

function updateReferralInfoRequest() {
    const referralId = $("#info-hidden-referral-id").val()
    const pay = $('#pay').val();
    const unpaid_referrals = $('#unpaid_referrals').val();
    if (unpaid_referrals < pay){
        alert(`To'lov qilinadiganlar soni ${unpaid_referrals} dan kichik bo'lishi kerag.`)
        return
    }
    $.ajax({
        url: `${referralId}/update/info/api/`,
        type: 'PATCH',
        contentType: "application/json",  // Set content type to JSON
        data: JSON.stringify({
            pay: pay,
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

            $('#payObject').modal('hide');
            location.reload()
        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("Mijoz yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}
