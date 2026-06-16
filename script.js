function calculateNetwork() {

    const ip = document.getElementById("ip").value;
    const cidr = parseInt(document.getElementById("cidr").value);

    const parts = ip.split(".");

    if(parts.length !== 4){
        alert("Invalid IP");
        return;
    }

    const network =
        `${parts[0]}.${parts[1]}.${parts[2]}.0`;

    const broadcast =
        `${parts[0]}.${parts[1]}.${parts[2]}.255`;

    const hosts =
        Math.pow(2, 32 - cidr) - 2;

    document.getElementById("result").innerHTML = `
        <h3>Results</h3>

        <p><b>Network:</b> ${network}</p>

        <p><b>Broadcast:</b> ${broadcast}</p>

        <p><b>CIDR:</b> /${cidr}</p>

        <p><b>Hosts:</b> ${hosts}</p>
    `;
}
