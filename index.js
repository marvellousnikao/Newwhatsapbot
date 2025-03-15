const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") console.log("✅ Bot is online!");
        if (connection === "close") console.log("❌ Bot disconnected!");
    });

    sock.ev.on("messages.upsert", async (m) => {
        const message = m.messages[0];
        if (!message.message) return;
        const text = message.message.conversation || message.message.extendedTextMessage?.text;

        if (text === "!ping") {
            await sock.sendMessage(message.key.remoteJid, { text: "Pong!" });
        }
    });
}

startBot();
