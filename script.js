function calculateNetwork() {
    const ip = document.getElementById("ip").value.trim();
    const cidr = Number(document.getElementById("cidr").value);
    const result = document.getElementById("result");

    const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;

    if (!ipRegex.test(ip) || cidr < 0 || cidr > 32) {
        result.innerHTML = '<div class="error">Enter a valid IPv4 address and CIDR prefix.</div>';
        return;
    }

    const octets = ip.split(".").map(Number);
    const ipNumber =
        ((octets[0] << 24) |
            (octets[1] << 16) |
            (octets[2] << 8) |
            octets[3]) >>> 0;

    const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const networkNumber = (ipNumber & mask) >>> 0;
    const broadcastNumber = (networkNumber | (~mask >>> 0)) >>> 0;

    const formatIp = (value) =>
        [
            (value >>> 24) & 255,
            (value >>> 16) & 255,
            (value >>> 8) & 255,
            value & 255
        ].join(".");

    const network = formatIp(networkNumber);
    const broadcast = formatIp(broadcastNumber);
    const hostCount = cidr >= 31 ? (2 ** (32 - cidr)) : Math.max(0, 2 ** (32 - cidr) - 2);

    result.innerHTML = `
        <div class="result-box">
            <div class="result-row">
                <span class="label">Network Address</span>
                <span class="value">${network}</span>
            </div>
            <div class="result-row">
                <span class="label">Broadcast Address</span>
                <span class="value">${broadcast}</span>
            </div>
            <div class="result-row">
                <span class="label">CIDR Notation</span>
                <span class="value">/${cidr}</span>
            </div>
            <div class="result-row">
                <span class="label">Address Capacity</span>
                <span class="value">${hostCount}</span>
            </div>
        </div>
    `;
}
