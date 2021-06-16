var data = null;

function reqListener () {
    console.log(this.responseText);
}

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()
request.addEventListener("load", reqListener);
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=040b11f32a04d2bce1b40a76358d24d0', true)

request.onload = function () {

  // Begin accessing JSON data here
  data = JSON.parse(this.response);
  
  if(data.success == true) {
      console.log ("success");
  }
  else {
    alert(data.error.message);
    resetElements();
  }
}

request.onerror = function () {
    console.log ("Network Error");
}

// Send request
request.send()

const fromCurr = document.getElementById('from_currency');
const fromAmt = document.getElementById ('from_amount');
const toCurr = document.getElementById('to_currency');
const toAmt = document.getElementById ('to_amount');
const rate = document.getElementById ('rate');
const convert = document.getElementById ('convert');
var disError = document.getElementById('error');
const date = document.getElementById('date');
date.value = date.max = new Date().toISOString().substring(0,10);

//adding the function since browser cannot connect to API for currencies other than GPB
// for this phase of development - UPDATE AFTER CONNECTION
disableOtherThanGBP();

fromCurr.addEventListener('change', calculate);
fromAmt.addEventListener('input', calculate);
toCurr.addEventListener('change', calculate);
toAmt.addEventListener('input', calculate);
date.addEventListener('input', displayCalender);

convert.addEventListener('click', () => {
    if (data.date === date.value) {
        disError.innerText = "";
        calculate();
    }
    else {
        disError.innerText = `Error : Exchange rate is not available for ${date.value} date`;
    }
});

function disableOtherThanGBP (){
    var optionToCurr = fromCurr.getElementsByTagName("option");
    for (var i = 0; i < optionToCurr.length; i++) {
        (optionToCurr[i].value != "GBP") ? optionToCurr[i].disabled = true : optionToCurr[i].disabled = false ;
    }
}

// calculate To currency amount
function calculate () {
    const from_currency = fromCurr.value;
    const to_currency = toCurr.value;
    const rateToday = data.rates[to_currency];

    if (rateToday == undefined || rateToday == "") {
        disError.innerText = `Error : Exchange rate is not available for ${to_currency} currency`; 
    }
    else{
        rate.innerText = `1 ${from_currency} = ${rateToday} ${to_currency}`;
        toAmt.value = (fromAmt.value * rateToday).toFixed(2);
    }

}

// calender display
function displayCalender () {
    date.setAttribute("type", "date");
    date.setAttribute("value", "2020-01-01");
    toAmt.value = 0;
}

// reset HTML elememets id error occurs from server
function resetElements () {
    convert.disabled = true;
    fromAmt.disabled = true;
}
