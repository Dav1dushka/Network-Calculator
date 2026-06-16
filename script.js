function calculateNetwork() {

    const ip = document.getElementById("ip").value.trim();
    const cidr = parseInt(document.getElementById("cidr").value);

    const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;

    if (!ipRegex.test(ip)) {

        document.getElementById("result").innerHTML = `
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
        <span class="label">CIDR</span>
        <span class="value">/${cidr}</span>
    </div>

    <div class="result-row">
        <span class="label">Usable Hosts</span>
        <span class="value">${hosts}</span>
    </div>

</div>
`;
