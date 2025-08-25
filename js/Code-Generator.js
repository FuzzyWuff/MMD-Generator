const salt = "7oXtAXHz";

function getDate() {
  const now = new Date();
  // get last day of current month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay;
}

async function sha256Hex(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateCode(name, date, isSpicy, isRetry) {
  let hashKey = "";
  if (isRetry && isSpicy) hashKey = "bundabunda";
  else if (isRetry && !isSpicy) hashKey = "mikumiku";
  else if (!isRetry && isSpicy) hashKey = "bunda";
  else hashKey = "miku";

  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth()+1).padStart(2, "0")}/${date.getFullYear()}`;
  const codeKey = `${hashKey}${name}#${formattedDate}${salt}`;

  const hash64 = await sha256Hex(codeKey);
  let finalCode = "";
  for (const ch of hash64) {
    if (!isNaN(parseInt(ch))) finalCode += ch;
  }

  if (finalCode.length === 5) {
    finalCode = finalCode + String(date.getMonth() + 1).padStart(2, "0");
  }

  if (!isRetry && finalCode.length <= 4) {
    return await generateCode(name.repeat(2), date, isSpicy, true);
  }

  return finalCode.slice(0, 6);
}

async function main() {
    const playerName = document.getElementById('name').value.trim();
    const date = getDate();
    const premiumCode = await generateCode(playerName, date, false, false);
    const spicyCode = await generateCode(playerName, date, true, false);
    document.getElementById('Premium').innerHTML = `Premium Code: ${premiumCode}`;
    document.getElementById('Spicy').innerHTML = `Spicy Code: ${spicyCode}`;
}
