function getSelectOption(needSelectId = 1) {
    let options = ``
    let selectedProductId = 1
    productsList.forEach((product, index) => {
        options += `<option value="${product.id}" id="${product.id}" ${product.id === needSelectId ? 'selected' : ''}>${product.name}</option>`
        if (needSelectId === product.id) {
            selectedProductId = product.id
        }
    });
    return [options, selectedProductId]
}

function addProcedureExpanse(procedureId) {
    let options = getSelectOption()
    const tempId = getRandomNumber()
    console.log(procedureId)
    const procedureExpanseDiv = $(`#procedure${procedureId}Expanses`)
    let product = getPriceById(options[1])
    let expanseDiv = `<form class="expanses-pr-item-${procedureId}">
                                <div class="row mb-2 gy-3 gx-2">
                                    <input type="hidden" name="expanse_id" value="0">
                                    <div class="col-sm-4">
                                        <select class="form-control form-control-sm"
                                                id="expanseId-${tempId}"
                                                name="product"
                                                onchange="updateProductPrice(${tempId})">
                                             ${options[0]}
                                        </select>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="d-flex gap-2 flex-between-center">
                                            <input value="${product[1]}"
                                                   class="form-control form-control-sm"
                                                   name="quantity"
                                                   id="quantityInput-${tempId}"
                                                   type="text"
                                                   placeholder="Property"/>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="d-flex gap-2 flex-between-center">
                                            <input data-mask="# ##0,00"
                                                   value="${product[0]}"
                                                   class="form-control form-control-sm"
                                                   id="priceInputId-${tempId}"
                                                   name="price"
                                                   type="tel"
                                                   placeholder="Property"/>
                                        </div>
                                    </div>
                                </div>
                            </form>`
    procedureExpanseDiv.append(expanseDiv)
}

function updateProductPrice(expanseId) {
    const e = document.getElementById(`expanseId-${expanseId}`);
    const selectedOptionId = e.options[e.selectedIndex].id;
    const product = getPriceById(selectedOptionId)
    $(`#priceInputId-${expanseId}`).val(product[0])
    $(`#quantityInput-${expanseId}`).val(product[1])
}

function getPriceById(productId) {
    const product = productsList.find(p => p.id === Number(productId));  // Find product by ID
    console.log(productId)
    const price = product ? formatAmount(product.price) : 0;  // Return the price if product is found, otherwise null
    return [price, product.default_quantity]
}

function formatAmount(amount) {
    // Format the number with comma separators and then replace commas with spaces
    return amount.toLocaleString().replace(/,/g, ' ');
}

function getRandomNumber() {
    return Math.floor(Math.random() * (500 - 30 + 1)) + 30
}

function addProcedureItem() {
    const procedureItemsDiv = $(`#procedureItemsMain`)
    lasProcedureTreatmentCount += 1
    const treatmentPrice = formatAmount(getPriceByQuantity(lasProcedureTreatmentCount))
    const procedureId = getRandomNumber()
    const procedureDivId = `procedureDivId-${procedureId}`
    const row = `<div class="position-relative rounded-1 border bg-body-emphasis p-3 mb-3" id=${procedureDivId}>
                            <div class="position-absolute end-0 top-0 mt-2 me-3 z-1" id="removeButtonDivId-${procedureId}">
                                <button class="btn btn-link btn-sm p-0" type="button" onclick="removeProcedureItem('${procedureId}')"><span
                                        class="fas fa-times-circle text-danger" data-fa-transform="shrink-1"></span>
                                </button>
                            </div>
                            <form class="procedures-form" id="form-procedure-id-${procedureId}" data-real-id="${procedureId}">
                                <div class="row gx-2 ">
                                    <div class="col-sm-4 mb-3">
                                        <label class="form-label" for="field-name">&nbsp;</label>
                                        <h4 class="form-control form-control-sm">${lasProcedureTreatmentCount}-muolaja</h4>
                                    </div>
                                    <div class="col-sm-4 mb-3">
                                        <label class="form-label" for="price-${procedureId}">Baxosi(so'm).</label>
                                        <input class="form-control form-control-sm procedure-input-prices" 
                                            id="price-${procedureId}"
                                               data-treatment-count="${lasProcedureTreatmentCount}"
                                               value="${treatmentPrice}" data-mask="# ##0,00" name="price">
                                    </div>
                                    <div class="col-4 form-check form-switch ">
                                            <label class="form-check" for="received">Qabul
                                                qildi:</label>
                                            <div style="width: 100%" class="ps-4 justify-content-center">
                                                <input class="form-control  form-check-input"
                                                       style="padding-left: 30px; padding-top: 18px;  "
                                                       name="received" type="checkbox"
                                                       id="received-${procedureId}"/>
                                            </div>
                                        </div>
                                    <input type="hidden" name="treatment_count"
                                           value="${lasProcedureTreatmentCount}">
                                    <input type="hidden" name="procedure_item_id" value="0"> 
                                </div>
                            </form>
                            <div class="accordion col-12  " id="accordionExample${procedureId}">
                                        <div class="accordion-item">
                                            <div class="accordion-header card-header bg-body-tertiary"
                                                 id="heading${procedureId}"
                                                 style="padding: 3px 3px 3px 10px;">
                                                <button class="accordion-button bg-body-tertiary collapsed"
                                                        type="button"
                                                        style="padding: 0"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapse${procedureId}"
                                                        aria-expanded="true"
                                                        aria-controls="collapse${procedureId}">Muolaja
                                                    xarajatlari.
                                                </button>
                                            </div>
                                            <div class="accordion-collapse collapse"
                                                 id="collapse${procedureId}"
                                                 aria-labelledby="heading${procedureId}"
                                                 data-bs-parent="#accordionExample${procedureId}">
                                                <div class="accordion-body">
                                                    <div class="card-body" style="padding: 0">
                                                        <div class="row gx-2 flex-between-center mb-3">
                                                            <div class="col-sm-4">
                                                                <h6 class="mb-0 text-600">Maxsulot</h6>
                                                            </div>
                                                            <div class="col-sm-4">
                                                                <h6 class="mb-0 text-700">Soni.</h6>
                                                            </div>
                                                            <div class="col-sm-4">
                                                                <h6 class="mb-0 text-700">Baxosi(1 ta maxsulot).</h6>
                                                            </div>
                                                        </div>
                                                        <div id="procedure${procedureId}Expanses">
                                                        ${getExpanseItems(procedureId)}
                                                        </div>
                                                        <div class="mt-3 text-end">
                                                            <button type="button"
                                                                    onclick="addProcedureExpanse(${procedureId})"
                                                                    class="btn btn-secondary ">Xarajat qo'shish.
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </div>`
    procedureItemsDiv.append(row)
    if (newProcedureDivIdList) {
        $(`#removeButtonDivId-${newProcedureDivIdList[newProcedureDivIdList.length - 1]}`).empty()
    }
    $("#number_of_recommended_treatments").val(lasProcedureTreatmentCount)
    newProcedureDivIdList.push(procedureId)
    updateDataCacher()
}

function getPriceByQuantity(quantity) {
    let lastPrice = pricesList[pricesList.length - 1].price; // Get the price of the last item
    for (const range of pricesList) {
        if (quantity >= range.start_quantity && quantity <= range.end_quantity) {
            return range.price;
        }
    }
    return lastPrice; // If no range matches, return the last item's price
}

function getExpanseItems(procedureId) {
    const defaultProducts = productsList.filter(product => product.default);
    let expanses = ``
    defaultProducts.forEach(product => {
        const tempExpanseId = getRandomNumber()
        expanses += `<form class="expanses-pr-item-${procedureId}">
                        <div class="row mb-2 gy-3 gx-2">
                            <input type="hidden" name="expanse_id" value="0">
                            <div class="col-sm-4">
                                <select class="form-control form-control-sm"
                                        id="expanseId-${tempExpanseId}"
                                        name="product"
                                        onchange="updateProductPrice(${tempExpanseId})">
                                    ${getSelectOption(product.id)}
                                </select>
                            </div>
                            <div class="col-sm-4">
                                <div class="d-flex gap-2 flex-between-center">
                                    <input value="${product.default_quantity}"
                                           class="form-control form-control-sm"
                                           name="quantity"
                                           id="quantityInput-${tempExpanseId}"
                                           type="text"
                                           placeholder="Soni"/>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="d-flex gap-2 flex-between-center">
                                    <input data-mask="# ##0,00"
                                           value="${formatAmount(product.price)}"
                                           class="form-control form-control-sm"
                                           id="priceInputId-${tempExpanseId}"
                                           name="price"
                                           type="tel"
                                           placeholder="Qiymati"/>
                                </div>
                            </div>
                        </div> 
                     </form>`
    });
    return expanses
}

function removeProcedureItem(divProcedureId) {

    if ($(`#received-${divProcedureId}`).is(':checked')) {
        alert("Bu muolaja qabul qilingan shu sababli uni o'chira olmaysiz!")
        return
    }

    lasProcedureTreatmentCount -= 1
    const procedureItemDiv = $(`#procedureDivId-${divProcedureId}`)
    procedureItemDiv.remove()
    newProcedureDivIdList.pop()
    if (newProcedureDivIdList) {
        const lastItem = newProcedureDivIdList[newProcedureDivIdList.length - 1]
        const removeButton = `<button class="btn btn-link btn-sm p-0" type="button" onclick="removeProcedureItem('${lastItem}')"><span
                                        class="fas fa-times-circle text-danger" data-fa-transform="shrink-1"></span>
                                </button>`
        $(`#removeButtonDivId-${lastItem}`).append(removeButton)
    }
    console.log(lasProcedureTreatmentCount)
    if (lasProcedureTreatmentCount >= 0) {
        console.log(lasProcedureTreatmentCount)
        $("#number_of_recommended_treatments").val(lasProcedureTreatmentCount)
    }
    updateDataCacher()
    deletedProcedureItems.push(divProcedureId)
    console.log(deletedProcedureItems)
}


function getTransfersTotalPrice() {
    const transferElements = $('.payment-amount-td')
    let totalPrice = 0
    transferElements.each(function () {
        totalPrice += Number(this.dataset.transferAmount)
    });
    return totalPrice
}

function updateBillingData() {
    const discount = removeSpacesFromNumber($("#discount-input").val()) || 0
    const cashPay = removeSpacesFromNumber($("#cash-pay").val()) || 0
    const cardPay = removeSpacesFromNumber($("#card-pay").val()) || 0
    const cardTransferPay = removeSpacesFromNumber($("#card-transfer-pay").val()) || 0
    const newPaid = cashPay + cardPay + cardTransferPay
    const transferPaid = getTransfersTotalPrice()
    const totalPaid = newPaid + transferPaid
    const totalPrice = getTotalPrice()
    const billingData = {
        "totalPrice": Math.max(totalPrice, 0),
        "discount": Math.max(discount, 0),
        "paid": Math.max(totalPaid, 0),
        "needPaid": Math.max((totalPrice - totalPaid - discount), 0)
    }
    $('#billing-total-price').text(formatCurrency(billingData['totalPrice']));
    $('#billing-discount').text(formatCurrency(billingData['discount']));
    $('#billing-paid').text(formatCurrency(billingData['paid']));
    $('#billing-need-paid').text(formatCurrency(billingData['needPaid']));
}

function getTotalPrice() {
    const transferElements = $('.procedure-input-prices')
    let totalPrice = 0
    transferElements.each(function () {
        totalPrice += removeSpacesFromNumber(this.value)
    });
    return totalPrice
}

function disablePrintButton() {
    const printButton = $('#print-check-button')
    printButton.attr('data-can-print', "no");
}

function updateDataCacher() {
    updateBillingData()
    disablePrintButton()
}

function printCheck() {
    const canPrint = document.getElementById('print-check-button').dataset.canPrint;
    if (canPrint === 'no') {
        alert("Chek chiqarishdan oldin ma'lumotlarni saqlang.")
        return
    }
    window.print();
}

function getFormExpanses(procedureItemId) {
// expanses-pr-item-${tempExpanseId}
    const procedureExpansesForms = $(`.expanses-pr-item-${procedureItemId}`);

    const formsData = [];

    procedureExpansesForms.each(function (index, form) {
        const formData = {};

        $(form).find("input, select, textarea").each(function () {
            const inputName = $(this).attr("name");
            let inputValue;

            if (inputName === "price") {
                inputValue = removeSpacesFromNumber($(this).val())
            } else if (["quantity", "product", "expanse_id"].includes(inputName)) {
                inputValue = Number($(this).val())
            }
            // For other inputs
            else {
                inputValue = $(this).val();
            }

            if (inputName) {
                formData[inputName] = inputValue;
            }
        });
        formsData.push(formData);
    });
    // console.log(formsData);
    return formsData
}

function updateProcedure() {
    const proceduresForms = $(".procedures-form");

    const formsData = [];

    proceduresForms.each(function (index, form) {
        const formData = {};
        $(form).find("input, select, textarea").each(function () {
            const inputName = $(this).attr("name");
            let inputValue;

            // Check if the input is a checkbox
            if ($(this).attr("type") === "checkbox") {
                inputValue = !!$(this).is(":checked");
            }
            // Check if the input is a "price" field
            else if (inputName === "price") {
                inputValue = removeSpacesFromNumber($(this).val())
            } else if (["procedure_item_id", "treatment_count"].includes(inputName)) {
                inputValue = Number($(this).val())
            }
            // For other inputs
            else {
                inputValue = $(this).val();
            }

            if (inputName) {
                formData[inputName] = inputValue;
            }
        });
        formData["expanses"] = getFormExpanses(form.dataset.realId)
        formsData.push(formData);
    });

    console.log(formsData);

}

window.onload = updateBillingData;