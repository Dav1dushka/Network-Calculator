# IPv4 Network Calculator

A responsive, browser-based IPv4 subnet calculator for developers, students, and network administrators.

**Live demo:** https://dav1dushka.github.io/Network-Calculator/

## Features

- Validate IPv4 addresses and CIDR prefixes from `/0` through `/32`.
- Calculate network address, broadcast address, subnet mask, wildcard mask, address count, and usable host range.
- Handle `/31` point-to-point networks and `/32` host routes explicitly.
- Load example networks with one click.
- Copy calculation results and share a URL that restores the selected address and prefix.
- Responsive layout with keyboard focus styles and status messages for assistive technology.
- Runs entirely in the browser; no account, backend, or external API is required.

## Try these examples

| Input | Expected network | Notes |
| --- | --- | --- |
| `192.168.1.10/24` | `192.168.1.0` | 256 total addresses; 254 usable hosts |
| `172.16.5.10/20` | `172.16.0.0` | Mask: `255.255.240.0` |
| `10.10.10.10/31` | `10.10.10.10` | Two usable addresses for point-to-point links |
| `203.0.113.7/32` | `203.0.113.7` | Single-address host route |
| `192.0.2.1/0` | `0.0.0.0` | Entire IPv4 address space |

## Run locally

1. Clone or download this repository.
2. Open `index.html` in a modern browser.

No dependencies, package installation, build step, or server-side code are needed.

## Manual verification checklist

- [ ] `192.168.1.10/24` returns network `192.168.1.0`, broadcast `192.168.1.255`, and 254 usable hosts.
- [ ] `172.16.5.10/20` returns network `172.16.0.0` and mask `255.255.240.0`.
- [ ] `10.10.10.10/31` reports two usable point-to-point addresses.
- [ ] `203.0.113.7/32` reports one address.
- [ ] `256.1.1.1`, incomplete addresses, and non-numeric octets are rejected.
- [ ] Copy results and share-link actions work in a browser context that supports clipboard access.
- [ ] Layout remains usable on narrow mobile screens.

## Project structure

- `index.html` — accessible form and results markup.
- `style.css` — responsive styling.
- `script.js` — input validation, subnet calculations, example buttons, clipboard actions, and shareable URL state.

## Built with

HTML5 · CSS3 · Vanilla JavaScript

## Scope

This is a client-side utility and portfolio project. It does not scan networks, send traffic, or make requests to external services.
