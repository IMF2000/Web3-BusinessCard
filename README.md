# Web3-BusinessCard

Minimal on-chain business card stored in a smart contract and served via a Cloudflare Worker. This repo is a practical demo of what’s possible — and what to watch out for — when rendering Web3 content straight from a contract.

Live demo: https://businesscard.imf2000.workers.dev/

---

## Overview

- The Solidity contract (`OnchainCard.sol`) holds the HTML/CSS as a constant string and exposes `render()` to return it.
- The contract is deployed to zkSync Era Sepolia.
- A Cloudflare Worker (`worker.js`) calls `render()` via RPC and serves the result as a webpage.
- No traditional frontend app or static hosting is required; the Worker is the site.

### Why this matters (security demonstration)

- **On-chain integrity vs. off-chain rendering:** Although the HTML originates from the contract, the Worker can modify it before returning it to users. This repo intentionally demonstrates that possibility.
- **Auditability:** Anyone can compare the Worker’s response against the raw `render()` return value from the contract to detect divergence.
- **Takeaway:** The blockchain guarantees integrity of the stored data, but the **rendering path** (Workers, servers, proxies, CDNs, browsers) must also be trusted or verified.

### Immutability & permanence (data hygiene)

- **Immutability on mainnet:** If this contract is deployed to an L1/L2 **mainnet**, the embedded HTML becomes **effectively permanent and publicly available**. You cannot rely on “deleting” or “unpublishing” on-chain content.
- **Privacy & PII:** Never embed sensitive information (e.g., personal addresses, phone numbers, emails you don’t want indexed) directly into on-chain HTML. Assume search engines, mirrors, and archival nodes can read and redistribute it.
- **Revision model:** To change content, you must **deploy a new contract** (new address) and update the Worker’s `CONTRACT` variable. Old content remains accessible on-chain.
- **Right-to-be-forgotten:** Blockchains are not suitable for data that may need erasure. Keep any potentially sensitive data **off-chain** and gate its delivery at the edge/app layer.


---

## Architecture (How it works)

1. **Contract** — Holds the business-card HTML/CSS. A pure `render()` function returns the HTML string.
2. **Worker** — Reads the contract via JSON-RPC, may optionally adjust/augment the HTML, and returns it with proper headers.
3. **Edge delivery** — Cloudflare Workers deploy to the edge for low latency and high availability.

---

## Tech Stack

- Solidity ^0.8.24
- zkSync Era Sepolia (L2)
- Hardhat
- Cloudflare Workers + Wrangler

---

## Setup

1) Clone and install

    git clone https://github.com/IMF2000/Web3-BusinessCard.git
    cd Web3-BusinessCard
    npm install

2) Compile

    npx hardhat compile

3) Deploy the contract (example)

    npx hardhat run scripts/deploy.js --network sepolia

4) Configure the Worker (example wrangler.toml vars)

    [vars]
    CONTRACT = "0xYOURCONTRACTID"
    RPC_URL  = "https://sepolia.era.zksync.dev"

5) Deploy the Worker

    npx wrangler deploy

---

## Verifying “chain vs served” output

To verify the Worker hasn’t modified the HTML, compare the Worker’s response with the contract’s raw `render()` output.

- **Get the Worker HTML:** open https://businesscard.imf2000.workers.dev and view source (or `curl` it).
- **Get the raw contract output:** call `render()` directly over JSON-RPC with any client. Example using `ethers` (v6):

    # install once:
    npm i ethers

    # scripts/dump_render.mjs
    import { ethers } from "ethers";
    const provider = new ethers.JsonRpcProvider("https://sepolia.era.zksync.dev");
    const abi = [
      { "inputs": [], "name": "render", "outputs": [{"internalType":"string","name":"","type":"string"}], "stateMutability":"pure", "type":"function" }
    ];
    const addr = "0xYOURCONTRACTID";
    const c = new ethers.Contract(addr, abi, provider);
    const html = await c.render();
    console.log(html);

    # run it:
    node scripts/dump_render.mjs > onchain.html

Now diff `onchain.html` against what the Worker served. Any change indicates a post-chain modification.

---

## Recreating this repo (what we did)

1. Wrote a tiny Solidity contract (`OnchainCard.sol`) that returns a complete HTML document from `render()`.
2. Deployed it to zkSync Era Sepolia and verified the address.
3. Built a Cloudflare Worker (`worker.js`) that:
   - connects to the RPC node,
   - calls `render()` on the configured contract,
   - **optionally modifies** the HTML (demonstrate security implications),
   - returns it with appropriate headers.
4. Wired up deployment via `wrangler.toml` (with `CONTRACT` and `RPC_URL`).
5. Documented how to independently verify that the served HTML matches the on-chain string.

---

## License

[MIT License](LICENSE)
