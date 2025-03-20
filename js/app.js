$(document).ready(function () {
  function calculateTip() {
    let billAmount = parseFloat($('#billAmount').val());
    let tipPercentage = parseFloat($('#tipPercentage').val());
    let splitCount = parseInt($('#splitCount').val());
    let currency = $('#currency').val();

    let missingFields = [];
    if (!billAmount || billAmount <= 0) missingFields.push("Bill Amount");
    if (!tipPercentage || tipPercentage <= 0) missingFields.push("Tip Percentage");
    if (!splitCount || splitCount <= 0) missingFields.push("Number of People");

    if (missingFields.length > 0) {
      alert("Please enter valid values for: " + missingFields.join(", "));
      return;
    }

    if (currency === 'USD') {
      $.getJSON('https://api.exchangerate-api.com/v4/latest/BZD')
        .done(function (data) {
          let rate = data.rates.USD;
          $('#exchangeRateInfo').text(`Exchange Rate: 1 BZD = ${rate.toFixed(4)} USD`);
          performCalculation(billAmount, tipPercentage, splitCount, rate, 'USD $');
        })
        .fail(function () {
          alert("Currency conversion is temporarily unavailable. Please try again later.");
        });
    } else {
      $('#exchangeRateInfo').text('');
      performCalculation(billAmount, tipPercentage, splitCount, 1, 'BZD $');
    }
  }

  function performCalculation(billAmount, tipPercentage, splitCount, rate, currencySymbol) {
    let convertedBill = billAmount * rate;
    let tipTotal = convertedBill * (tipPercentage / 100);
    let totalBill = convertedBill + tipTotal;
    let amountPerPerson = totalBill / splitCount;

    $('#tipTotal').text(currencySymbol + tipTotal.toFixed(2));
    $('#totalBill').text(currencySymbol + totalBill.toFixed(2));
    $('#perPerson').text(currencySymbol + amountPerPerson.toFixed(2));
  }

  function clearFields() {
    $('#billAmount').val('');
    $('#tipPercentage').val('');
    $('#splitCount').val('1');
    $('#currency').val('BZD');
    $('#exchangeRateInfo').text('');

    $('#tipTotal').text('BZD $0.00');
    $('#totalBill').text('BZD $0.00');
    $('#perPerson').text('BZD $0.00');
  }

  $('#calculateBtn').on('click', calculateTip);
  $('#clearBtn').on('click', clearFields);
});
