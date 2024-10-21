function createTransfer() {
    const firstForm = $("#first-form").serialize()
    if (!isValid()) {
        return
    }
    console.log(firstForm)
    $.ajax({
        url: createTransferUrl,
        type: 'POST',
        data: firstForm,
        headers: {
            'X-CSRFToken': csrfToken  // Set CSRF token in headers (important for JSON requests)
        },
        success: function (response) {
            location.reload()
        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            alert("O'tkazma yaratishda xatolik yuz berdi dasturchi bilan bog'laning");
        }
    });
}

function isValid() {
    const amount = $("#amount").val();
    const errorDiv = $("#errorDiv")
    let hasError = false
    let row = ""
    if (!amount) {
        row += "<strong> - Qiymati.</strong> maydonini to'ldirish shart.<br>"
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
