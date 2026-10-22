(function (root, factory) {
    const api = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    } else {
        root.NetworkCalculator = api;
    }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    function parseIPv4(value) {
        const octets = value.split(".");
        if (octets.length !== 4) return null;

        const numbers = octets.map((octet) => {
            if (!/^(0|[1-9]\\d{0,2})$/.test(octet)) return null;
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

    return { calculateSubnet };
});
