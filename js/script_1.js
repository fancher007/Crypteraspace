const cryptoCurrencies = [
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
  "FLR",
];
const walletNames = [
  "Metamask",
  "Polygon Wallet",
  "Tangem Wallet",
  "Binance Coin Wallet",
  "Trust Wallet",
  "SaitaMask",
  "Ownbit",
  "Coinbase",
  "SafePal",
  "Atomic",
  "Crypto.com",
  "Safepal Wallet",
  "Trezor Wallet",
  "Exodus Wallet",
  "Uniswap",
];

function generateRandomHash() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    return `${hours} hours`;
  }
}

function generateRandomTransaction() {
  const isMinutes = Math.random() < 0.5;
  const time = isMinutes
    ? Math.floor(Math.random() * 55) + 5 // 5 to 59 minutes
    : Math.floor(Math.random() * 23) + 1; // 1 to 24 hours

  // Select a random wallet name
  const randomWalletIndex = Math.floor(Math.random() * walletNames.length);

  return {
    wallet: walletNames[randomWalletIndex], // Pick a random wallet
    transactions: Math.floor(Math.random() * 100) + 50,
    burned: (Math.random() * (300000 - 1000) + 1000).toFixed(6),
    currency:
      cryptoCurrencies[Math.floor(Math.random() * cryptoCurrencies.length)],
    time: isMinutes ? time : time * 60,
    hash: generateRandomHash(),
  };
}

// function generateRandomTransaction(index) {
//   const isMinutes = Math.random() < 0.5;
//   const time = isMinutes
//     ? Math.floor(Math.random() * 55) + 5 // 5 to 59 minutes
//     : Math.floor(Math.random() * 23) + 1; // 1 to 24 hours

//   return {
//     wallet: walletNames[index % walletNames.length],
//     transactions: Math.floor(Math.random() * 100) + 50,
//     burned: (Math.random() * 1.5).toFixed(6),
//     currency:
//       cryptoCurrencies[Math.floor(Math.random() * cryptoCurrencies.length)],
//     time: isMinutes ? time : time * 60,
//     hash: generateRandomHash(),
//   };
// }

function updateTransactions() {
  const tableBody = document.getElementById("transactionTableBody");
  const newTransaction = generateRandomTransaction(0);

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td class="wallet-name">${newTransaction.wallet}</td>
        <td>${newTransaction.transactions}</td>
        <td class="burned">-${newTransaction.burned} ${
    newTransaction.currency
  }</td>
        <td class="hash">${newTransaction.hash.substring(0, 8)}...</td>
        <td class="time">${formatTime(newTransaction.time)}</td>
    `;

  newRow.style.opacity = "0";
  newRow.style.transition = "opacity 0.3s ease-in-out";
  tableBody.insertBefore(newRow, tableBody.firstChild);

  setTimeout(() => {
    newRow.style.opacity = "1";
  }, 50);

  if (tableBody.children.length > 15) {
    tableBody.removeChild(tableBody.lastChild);
  }
}

function initialPopulation() {
  const tableBody = document.getElementById("transactionTableBody");
  for (let i = 0; i < 15; i++) {
    const transaction = generateRandomTransaction(i);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="wallet-name">${transaction.wallet}</td>
            <td>${transaction.transactions}</td>
            <td class="burned">-${transaction.burned} ${
      transaction.currency
    }</td>
            <td class="hash">${transaction.hash.substring(0, 8)}...</td>
            <td class="time">${formatTime(transaction.time)}</td>
        `;
    tableBody.appendChild(row);
  }
}

initialPopulation();

function scheduleNextUpdate() {
  const delay = Math.floor(Math.random() * 5000) + 5000; // Random delay between 5000 and 10000 ms
  setTimeout(() => {
    updateTransactions();
    scheduleNextUpdate();
  }, delay);
}

scheduleNextUpdate();
