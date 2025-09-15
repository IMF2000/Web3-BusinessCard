// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OnchainCard {
    string private constant HTML =
unicode"<!doctype html><html><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
unicode"<title>Alistair — Information Security</title>"
unicode"<style>html,body{height:100%}body{margin:0;display:flex;align-items:center;justify-content:center;background:#0b0d12;color:#e6e9ef;"
unicode"font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif}"
unicode".card{max-width:720px;padding:7vmin 6vmin;background:#111622;border:1px solid #232a3b;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.35);text-align:center}"
unicode"h1{font-size:clamp(24px,6vw,40px);margin:.1em 0}"
unicode".creds{opacity:.9;margin:.25rem 0;font-size:clamp(14px,3.4vw,18px)}"
unicode".tag{opacity:.8;font-size:clamp(14px,3.4vw,18px)}"
unicode".links{margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;justify-content:center}"
unicode"a{color:#7aa2ff;text-decoration:none;border:1px solid #2a3550;padding:.6em .9em;border-radius:12px}"
unicode"a:hover{background:#0f1630}"
unicode"footer{margin-top:1.25rem;opacity:.6;font-size:12px}</style></head>"
unicode"<body><div class=card>"
unicode"<h1>Alistair — Information Security</h1>"
unicode"<div class=creds>C|CISO · CISM · CRISC · CISSP · CCSP · MCIIS</div>"
unicode"<div class=tag>InfoSec • Networks • Cloud • Web3</div>"
unicode"<div class=links>"
unicode"<a href='mailto:email@example.com'>email@example.com</a>"
unicode"<a href='https://linkedin.com/in/example'>LinkedIn</a>"
unicode"<a href='https://example.com'>example.com</a>"
unicode"</div>"
unicode"<footer>Immutable card on zkSync Era • <span id=addr></span></footer>"
unicode"</div></body></html>";

    function render() external pure returns (string memory) {
        return HTML;
    }
}

