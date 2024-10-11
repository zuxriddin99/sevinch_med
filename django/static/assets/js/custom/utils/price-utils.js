function removeSpacesFromNumber(numberStr) {
    return Number(numberStr.replace(/\s+/g, ''));
}


function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}

function phoneNumberInputUpdate(phoneNumber) {
    // Remove parentheses, spaces, and other non-numeric characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    // Add the country code prefix +998
    return '+998' + cleanedNumber;
}