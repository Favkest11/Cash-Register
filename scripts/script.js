let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const currencyUnit = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.10,
  'QUARTER': 0.25,
  'ONE': 1.00,
  'FIVE': 5.00,
  'TEN': 10.00,
  'TWENTY': 20.00,
  'ONE HUNDRED': 100.00
};

let cash = document.getElementById("cash");
let changeDue = document.getElementById("change-due");
let button = document.getElementById("purchase-btn");

button.addEventListener("click", () => {
  let cashProvided = parseFloat(cash.value);
  let change = Math.round((cashProvided - price) * 100) / 100;

  if (cashProvided < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (change === 0) {
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }

  let totalCid = cid.reduce((sum, [_, amt]) => sum + amt, 0);
  totalCid = Math.round(totalCid * 100) / 100;

 if (change === totalCid) {
  
  const changeArr = cid
    .filter(([_, amt]) => amt > 0)
    .reverse()
    .map(([unit, amt]) => [unit, amt]);

  
  cid = cid.map(([unit, _]) => [unit, 0]);

  changeDue.innerText =
    `Status: CLOSED\n` +
    changeArr
      .map(([unit, amt]) => `${unit}: $${amt.toFixed(2).replace(/\.?0+$/, '')}`)
      .join('\n');

  renderDrawerDetails();
  return;
}

  let reversedCid = [...cid].reverse();
  let changeLeft = change;
  let changeArr = [];


  let updatedCid = cid.map(([unit, amt]) => [unit, amt]);

  for (let [unit, amountAvailable] of reversedCid) {
    let unitValue = currencyUnit[unit];
    let amountToReturn = 0;

    while (changeLeft >= unitValue && amountAvailable >= unitValue) {
      amountToReturn += unitValue;
      amountAvailable -= unitValue;
      changeLeft = Math.round((changeLeft - unitValue) * 100) / 100;
    }

    if (amountToReturn > 0) {
      changeArr.push([unit, Math.round(amountToReturn * 100) / 100]);


      updatedCid = updatedCid.map(([u, amt]) =>
        u === unit ? [u, Math.round((amt - amountToReturn) * 100) / 100] : [u, amt]
      );
    }
  }

  let changeGiven = changeArr.reduce((sum, [_, amt]) => sum + amt, 0);
  changeGiven = Math.round(changeGiven * 100) / 100;

  if (changeGiven < change) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
  } else {
  
    cid = updatedCid;

    changeDue.innerText =
      `Status: OPEN\n` +
      changeArr.map(([unit, amt]) => `${unit}: $${amt.toFixed(2).replace(/\.?0+$/, '')}`).join("\n");
  }

  renderDrawerDetails();
});

function renderDrawerDetails() {
  const drawer = document.getElementById("drawer-details");
  const labels = {
    "PENNY": "Pennies",
    "NICKEL": "Nickels",
    "DIME": "Dimes",
    "QUARTER": "Quarters",
    "ONE": "Ones",
    "FIVE": "Fives",
    "TEN": "Tens",
    "TWENTY": "Twenties",
    "ONE HUNDRED": "Hundreds"
  };

  let html = "<strong>Change in drawer:</strong><br><br>";
  cid.forEach(([unit, amt]) => {
    html += `${labels[unit]}: $${amt.toFixed(2)}<br>`;
  });

  drawer.innerHTML = html;
}


renderDrawerDetails();
