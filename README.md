# PS4 Jailbreak Self-Host (FW 13.02 / 13.04 / 13.50 / 13.52)

A static, offline-capable exploit host for PS4 firmwares **13.02, 13.04, 13.50 and 13.52**, using the
WebKit browser exploit + kernel exploit and a HEN payload.

- English UI
- Caches everything in the browser for offline use (application cache)
- Works from a local LAN server **or** GitHub Pages

> **Only use this on a console you own.** This is a memory-only jailbreak: it is lost on every
> reboot and does not permanently modify the system.

---

## Requirements

- PS4 on firmware **13.02 / 13.04 / 13.50 / 13.52** (check **Settings → System → System Information**)
- For the local method: a PC on the **same Wi-Fi/LAN** as the PS4 with [Node.js](https://nodejs.org/) installed
- Optional: a USB drive is **not** required for these firmware versions (this is a browser-only exploit)

---

## Step 0 — Prepare the PS4

1. Check the firmware under **Settings → System → System Information**.
2. Stop automatic updates so the console doesn't patch past 13.52:
   - **Settings → Network → Set Up Internet Connection → (your Wi-Fi) → Custom**
   - **DNS Primary:** `62.210.38.117`
   - **DNS Secondary:** `0.0.0.0`
   - (This blocks Sony update/PSN hosts. Leave MTU, Proxy, etc. on Automatic/Do Not Use.)
3. Keep the PS4 and your PC on the **same network**.

---

## Method A — Local server (recommended)

1. On the PC, double-click **`start-ps4-host.cmd`** (or run `node serve.js` in this folder).
2. The window prints a URL, for example:
   ```
   Network: http://192.168.100.49:8080/   <-- use this on the PS4
   ```
   Note the IP (it can change when you reconnect to the network).
3. If the PS4 cannot load the page, allow the port through Windows Firewall. Open
   **PowerShell as Administrator** and run:
   ```
   netsh advfirewall firewall add rule name="PS4 JB Host" dir=in action=allow protocol=TCP localport=8080
   ```
4. Leave the server window open until the jailbreak is done.

To use a different port: `set PORT=8000 && node serve.js`

## Method B — GitHub Pages (no PC needed)

1. Enable Pages: repo **Settings → Pages → Source: Deploy from a branch → Branch `main` / `/ (root)` → Save**.
2. Wait about a minute. Your host will be at:
   ```
   https://<your-username>.github.io/ps4jailbreak/
   ```

---

## Run the exploit (on the PS4)

1. Open the PS4 **Internet Browser**.
2. Go to your host URL:
   - Local: `http://<PC-LAN-IP>:8080/`
   - Pages: `https://<your-username>.github.io/ps4jailbreak/`
3. The page detects your firmware and shows **"Firmware: 13.52 • compatible"**.
4. **First run only:** the page caches the files for offline use. When it shows
   **"CACHED (first run) — press X or tap to run"**, press **X**.
5. On the jailbreak page, a large **CLICK** button appears — press **X** on it.
6. Wait (30 seconds to a couple of minutes). **Do not close the page.**
7. Success looks like:
   ```
   JAILBREAK DONE!
   YOU CAN NOW EXIT THE BROWSER
   ```
   A HEN notification also appears in the top-left. Press/hold **Back** to leave the browser.
8. Verify under **Settings → System Information**.

---

## After a successful jailbreak

- The jailbreak is **memory-only**. After a reboot it is gone — just repeat the exploit.
- To stay offline while using it: **Settings → Network → Connect to the Internet → OFF**.
- If the payload provides GoldHEN-style services (connect from your PC using the PS4 IP):
  - **FTP** on port **2121**
  - **Payload / BinLoader** on port **9090**

---

## Troubleshooting

- **"JAILBREAK FAILED! RESTART THE CONSOLE AND TRY AGAIN.."**
  Reboot the PS4 fully before retrying — do **not** run it again on the same boot, it can cause a kernel crash.
- **First attempts failing is normal.** Clear the browser cache/data and retry; it often takes a few tries.
- **Page won't load (Method A):** confirm the PC IP, that both devices are on the same network, and that the
  firewall rule (or allow `node`) is in place.
- **Fine to retry after reboot:** yes. Only the rebooted state can be re-exploited.

---

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page: detects firmware, manages offline cache |
| `jb.html` | Jailbreak UI (CLICK button, progress, result) |
| `jb.js` / `core.js` / `mem.js` / `int64.js` / `rpc_worker.js` | Exploit chain |
| `ps4_offsets.js` | Per-firmware kernel offsets |
| `payload2.bin` / `goldhen.bin` | HEN payload |
| `patches/1302.bin`, `patches/1350.bin`, `patches/1352.bin` | Kernel patches per firmware |
| `cache.appcache` | Offline cache manifest |
| `serve.js` | Local static server (correct MIME types) |
| `start-ps4-host.cmd` | Windows launcher for `serve.js` |

---

## Credits

Exploit and payload work by the PS4 scene developers (SiSTR0/GoldHEN, WebKit/kernel exploit authors, and
the hosts this was adapted from). Host layout adapted from community self-host pages.
