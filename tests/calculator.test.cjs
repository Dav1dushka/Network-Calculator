const assert = require("node:assert/strict");
const test = require("node:test");
const { calculateSubnet } = require("../calculator-core.js");

function value(result, label) {
    const item = result.values.find(([name]) => name === label);
    assert.ok(item, `Expected result to contain "${label}"`);
    return item[1];
}

test("calculates a standard /24 subnet", () => {
    const result = calculateSubnet("192.168.1.10", 24);
    assert.equal(value(result, "Network address"), "192.168.1.0");
    assert.equal(value(result, "Broadcast address"), "192.168.1.255");
    assert.equal(value(result, "Subnet mask"), "255.255.255.0");
    assert.equal(value(result, "Wildcard mask"), "0.0.0.255");
    assert.equal(value(result, "First usable address"), "192.168.1.1");
    assert.equal(value(result, "Last usable address"), "192.168.1.254");
    assert.equal(value(result, "Total addresses"), "256");
    assert.equal(value(result, "Usable host addresses"), "254");
});

test("aligns a /20 network boundary correctly", () => {
    const result = calculateSubnet("172.16.5.10", 20);
    assert.equal(value(result, "Network address"), "172.16.0.0");
    assert.equal(value(result, "Broadcast address"), "172.16.15.255");
    assert.equal(value(result, "Subnet mask"), "255.255.240.0");
    assert.equal(value(result, "Wildcard mask"), "0.0.15.255");
    assert.equal(value(result, "Usable host addresses"), "4094");
});

test("handles /31 point-to-point networks", () => {
    const result = calculateSubnet("10.0.0.1", 31);
    assert.equal(value(result, "Network address"), "10.0.0.0");
    assert.equal(value(result, "Last address in range"), "10.0.0.1");
    assert.equal(value(result, "First usable address"), "10.0.0.0");
    assert.equal(value(result, "Last usable address"), "10.0.0.1");
    assert.equal(value(result, "Usable host addresses"), "2");
    assert.match(result.note, /both addresses are usable/i);
});

test("handles /32 single-host routes", () => {
    const result = calculateSubnet("203.0.113.7", 32);
    assert.equal(value(result, "Network address"), "203.0.113.7");
    assert.equal(value(result, "Last address in range"), "203.0.113.7");
    assert.equal(value(result, "Subnet mask"), "255.255.255.255");
    assert.equal(value(result, "Wildcard mask"), "0.0.0.0");
    assert.equal(value(result, "Total addresses"), "1");
    assert.equal(value(result, "Usable host addresses"), "1");
});

test("handles the /0 boundary without 32-bit shift overflow", () => {
    const result = calculateSubnet("203.0.113.7", 0);
    assert.equal(value(result, "Network address"), "0.0.0.0");
    assert.equal(value(result, "Broadcast address"), "255.255.255.255");
    assert.equal(value(result, "Subnet mask"), "0.0.0.0");
    assert.equal(value(result, "Wildcard mask"), "255.255.255.255");
    assert.equal(value(result, "Total addresses"), "4,294,967,296");
    assert.equal(value(result, "Usable host addresses"), "4,294,967,294");
});

test("rejects malformed and out-of-range IPv4 addresses", () => {
    for (const address of [
        "192.168.1", "192.168.1.256", "192.168.-1.1",
        "192.168.01.1", "1.2.3.4.5", "hello"
    ]) {
        assert.match(calculateSubnet(address, 24).error, /valid IPv4 address/i, address);
    }
});

test("rejects CIDR prefixes outside the integer range 0–32", () => {
    for (const prefix of [-1, 33, 24.5, NaN]) {
        assert.match(calculateSubnet("192.168.1.10", prefix).error, /CIDR prefix/i);
    }
});
