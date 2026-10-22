const { calculateSubnet } = window.NetworkCalculator;

const calculatorForm = document.getElementById("calculatorForm");
const ipInput = document.getElementById("ip");
const cidrInput = document.getElementById("cidr");
const message = document.getElementById("message");
const resultsSection = document.getElementById("resultsSection");
const resultList = document.getElementById("resultList");
const subnetNote = document.getElementById("subnetNote");
const copyButton = document.getElementById("copyButton");
const shareButton = document.getElementById("shareButton");
const exampleButtons = document.querySelectorAll("button[data-example]");

let currentResults = [];

const sharedParameters = new URLSearchParams(window.location.search);
const sharedAddress = sharedParameters.get("ip");
const sharedPrefix = sharedParameters.get("prefix");
if (sharedAddress) ipInput.value = sharedAddress;
if (/^(?:[0-9]|[12]\d|3[0-2])$/.test(sharedPrefix ?? "")) {
    cidrInput.value = sharedPrefix;
}

function renderResults(values, note) {
    currentResults = values;
    resultList.replaceChildren();

    values.forEach(([label, value], index) => {
        const row = document.createElement("div");
        row.className = `result-row${index < 2 ? " result-row-primary" : ""}`;

        const term = document.createElement("dt");
        term.textContent = label;
        const description = document.createElement("dd");
        description.textContent = value;
        row.append(term, description);
        resultList.append(row);
    });

    subnetNote.textContent = note;
    resultsSection.hidden = false;
}

calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const address = ipInput.value.trim();
    const prefix = Number(cidrInput.value);
    const result = calculateSubnet(address, prefix);

    if (result.error) {
        currentResults = [];
        message.textContent = result.error;
        message.className = "message is-error";
        resultsSection.hidden = true;
        copyButton.disabled = true;
        shareButton.disabled = true;
        return;
    }

    message.textContent = `Calculated ${address}/${prefix}.`;
    message.className = "message is-success";
    copyButton.disabled = false;
    shareButton.disabled = false;
    renderResults(result.values, result.note);

    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("ip", address);
    shareUrl.searchParams.set("prefix", String(prefix));
    window.history.replaceState(window.history.state, "", shareUrl);
});

exampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        ipInput.value = button.dataset.ip ?? "";
        cidrInput.value = button.dataset.prefix ?? "24";
        calculatorForm.requestSubmit();
    });
});

copyButton.addEventListener("click", async () => {
    if (currentResults.length === 0) return;

    const text = currentResults.map(([label, value]) => `${label}: ${value}`).join("\n");
    try {
        await navigator.clipboard.writeText(text);
        message.textContent = "Results copied to the clipboard.";
        message.className = "message is-success";
    } catch {
        message.textContent = "Clipboard access is unavailable in this browser. Select the results to copy them.";
        message.className = "message is-error";
    }
});

shareButton.addEventListener("click", async () => {
    if (currentResults.length === 0) return;

    try {
        await navigator.clipboard.writeText(window.location.href);
        message.textContent = "Share link copied. Anyone with the link can open this calculation.";
        message.className = "message is-success";
    } catch {
        message.textContent = "Clipboard access is unavailable. You can copy the shareable URL from the address bar.";
        message.className = "message is-error";
    }
});

calculatorForm.requestSubmit();
