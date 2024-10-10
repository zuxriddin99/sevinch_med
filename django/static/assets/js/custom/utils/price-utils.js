function removeSpacesFromNumber(numberStr) {
    return Number(numberStr.replace(/\s+/g, ''));
}


function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
}
