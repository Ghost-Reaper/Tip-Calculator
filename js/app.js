$(document).ready(function () {

  function calculateTip() {
    let billAmount = $('#billAmount').val();
    let tipPercentage = $('#tipPercentage').val();
    let splitCount = $('#splitCount').val();
    let currency = $('#currency').val();

    // Check for missing fields
    let missingFields = [];
    if (!billAmount || billAmount <= 0) missingFields.push("Bill Amount");
    if (!tipPercentage || tipPercentage <= 0) missingFields.push("Tip Percentage");
    if (!splitCount || splitCount <= 0) missingFields.push("Number of People");

    if (missingFields.length > 0) {
      alert("Please enter valid values for: " + missingFields.join(", "));
      return;
    }

    billAmount = parseFloat(billAmount);
    tipPercentage = parseFloat(tipPercentage);
    splitCount = parseInt(splitCount);

    if (currency === 'USD') {
      $.getJSON('https://api.exchangerate-api.com/v4/latest/BZD', function (data) {
        let rate = data.rates.USD;
        performCalculation(billAmount, tipPercentage, splitCount, rate);
      });
    } else {
      performCalculation(billAmount, tipPercentage, splitCount, 1);
    }
  }

  function performCalculation(billAmount, tipPercentage, splitCount, rate) {
    let convertedBill = billAmount * rate;
    let tipTotal = convertedBill * (tipPercentage / 100);
    let totalBill = convertedBill + tipTotal;
    let amountPerPerson = totalBill / splitCount;

    $('#tipTotal').text(tipTotal.toFixed(2));
    $('#totalBill').text(totalBill.toFixed(2));
    $('#perPerson').text(amountPerPerson.toFixed(2));
  }

  function clearFields() {
    $('#billAmount').val('');
    $('#tipPercentage').val('');
    $('#splitCount').val('1');
    $('#currency').val('BZD');

    $('#tipTotal').text('0.00');
    $('#totalBill').text('0.00');
    $('#perPerson').text('0.00');
  }

  $('#calculateBtn').on('click', calculateTip);
  $('#clearBtn').on('click', clearFields);
});
