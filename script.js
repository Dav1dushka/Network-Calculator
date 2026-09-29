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

function parseIPv4(value) {
    const octets = value.split(".");
    if (octets.length !== 4) return null;

    const numbers = octets.map((octet) => {
        if (!/^(0|[1-9]\d{0,2})$/.test(octet)) return null;
        const number = Number(octet);
        return number <= 255 ? number : null;
    });

    return numbers.some((octet) => octet === null) ? null : numbers;
}

function ipv4ToNumber(octets) {
    return octets.reduce((value, octet) => value * 256 + octet, 0);
}

function numberToIPv4(value) {
    return [
        Math.floor(value / 16777216) % 256,
        Math.floor(value / 65536) % 256,
        Math.floor(value / 256) % 256,
        value % 256
    ].join(".");
}

function calculateSubnet(address, prefix) {
    const octets = parseIPv4(address);
    if (!octets) return { error: "Enter a valid IPv4 address, such as 192.168.1.10." };
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
        return { error: "Choose a CIDR prefix between /0 and /32." };
    }

    const blockSize = 2 ** (32 - prefix);
    const inputNumber = ipv4ToNumber(octets);
    const networkNumber = Math.floor(inputNumber / blockSize) * blockSize;
    const broadcastNumber = networkNumber + blockSize - 1;
    const subnetMaskNumber = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const wildcardMaskNumber = 0xffffffff - subnetMaskNumber;
    const totalAddresses = blockSize;
    const usableHosts = prefix === 32
        ? 1
        : prefix === 31
            ? 2
            : Math.max(0, totalAddresses - 2);
    const firstUsableNumber = prefix >= 31 ? networkNumber : networkNumber + 1;
    const lastUsableNumber = prefix >= 31 ? broadcastNumber : broadcastNumber - 1;
    const endAddressLabel = prefix >= 31 ? "Last address in range" : "Broadcast address";

    return {
        values: [
            ["Network address", numberToIPv4(networkNumber)],
            [endAddressLabel, numberToIPv4(broadcastNumber)],
            ["Subnet mask", numberToIPv4(subnetMaskNumber)],
            ["Wildcard mask", numberToIPv4(wildcardMaskNumber)],
            ["First usable address", numberToIPv4(firstUsableNumber)],
            ["Last usable address", numberToIPv4(lastUsableNumber)],
            ["Total addresses", totalAddresses.toLocaleString("en-US")],
            ["Usable host addresses", usableHosts.toLocaleString("en-US")]
        ],
        note: prefix === 31
            ? "/31 networks are commonly used for point-to-point links, where both addresses are usable."
            : prefix === 32
                ? "/32 represents one host address."
                : "The first and last addresses in this subnet are reserved as the network and broadcast addresses."
    };
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
