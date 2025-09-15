import { createPublicClient, http, encodeFunctionData, decodeFunctionResult } from "viem";
import { toString as qrToString } from "qrcode"; // generates SVG

const ABI = [
  { type: "function", name: "render", stateMutability: "pure", inputs: [], outputs: [{ type: "string" }] }
];

async function getHtmlFromContract(contract, rpc) {
  const client = createPublicClient({ transport: http(rpc) });
  const data = encodeFunctionData({ abi: ABI, functionName: "render" });
  const result = await client.call({ to: contract, data });
  return decodeFunctionResult({ abi: ABI, functionName: "render", data: result.data });
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve robots.txt
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /", {
        headers: { "content-type": "text/plain" }
      });
    }

    try {
      const rpc = env.RPC_URL || "https://sepolia.era.zksync.dev";
      const contract = env.CONTRACT;
      const explorerUrl = `https://sepolia.explorer.zksync.io/address/${contract}`;
      const shortAddr = `${contract.slice(0, 6)}…${contract.slice(-4)}`;

      let html = await getHtmlFromContract(contract, rpc);

	html = html.replace("<html>", '<html lang="en">');

      // --- Verified footer (text + link) ---
      html = html.replace(
        /<footer>.*<\/footer>/,
        `<footer>
           <div style="margin-top:1rem;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;">
             <span style="background:#16a34a;color:#fff;padding:0.2em 0.55em;border-radius:6px;font-size:12px;">✓ Verified</span>
             <a href="${explorerUrl}" target="_blank" rel="noopener" style="color:#7aa2ff"> ${shortAddr}</a>
             <span id="qr-slot" style="display:inline-flex;align-items:center;gap:8px;"></span>
           </div>
         </footer>`
      );

      // --- Generate QR SVG for the explorer URL (about 120px wide) ---
      const qrSvg = await qrToString(explorerUrl, { type: "svg", margin: 0, width: 120 });

      // --- Inject QR into the placeholder span ---
      html = html.replace(
        'id="qr-slot"',
        'id="qr-slot"'
      ).replace(
        '</footer>',
        `<div style="opacity:.85;border:1px solid #2a3550;border-radius:12px;padding:6px">${qrSvg}</div></footer>`
      );

      // --- Extra UI polish ---
      html = html.replace(
        "</style>",
        `a {transition:all .2s ease-in-out;}
         a:hover {background:#1a2338;color:#9bbcff;}
         h1 {
           background: linear-gradient(90deg,#7aa2ff,#c084fc,#7aa2ff);
           background-size: 200% auto;
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           animation: shine 6s linear infinite;
         }
         @keyframes shine { to { background-position:200% center; } }
        </style>`
      );

html = html.replace(
  "</div></body>",
  `<div style="margin-top:2em;font-size:14px;opacity:.7">
     <a href="https://github.com/IMF2000/Web3-BusinessCard/" target="_blank" style="color:inherit;text-decoration:none">
       View on GitHub
     </a>
   </div></div></body>`
);

	return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
	  "X-Robots-Tag": "noai, noimageai, nosnippet, noarchive, notranslate, noindex"
        }
      });
    } catch (e) {
      return new Response(`<pre>Gateway error\n${e?.message || e}</pre>`, {
        status: 502,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }
  }
};
