function calculateNetwork() {

    const ip = document.getElementById("ip").value.trim();
    const cidr = parseInt(document.getElementById("cidr").value);

    const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;

    if (!ipRegex.test(ip)) {

        document.getElementById("result").innerHTML = `
            <div class="error">
                Invalid IPv4 Address
            </div>
        `;

        return;
    }

    const parts = ip.split(".");

    const network =
        `${parts[0]}.${parts[1]}.${parts[2]}.0`;

    const broadcast =
        `${parts[0]}.${parts[1]}.${parts[2]}.255`;

    const hosts =
        Math.pow(2, 32 - cidr) - 2;

    document.getElementById("result").innerHTML = `

        <div class="result-grid">

            <div class="card">
                <h3>Network</h3>
                <p>${network}</p>
            </div>

            <div class="card">
                <h3>Broadcast</h3>
                <p>${broadcast}</p>
            </div>

            <div class="card">
                <h3>CIDR</h3>
                <p>/${cidr}</p>
            </div>

            <div class="card">
                <h3>Hosts</h3>
                <p>${hosts}</p>
            </div>

        </div>
    `;
}
