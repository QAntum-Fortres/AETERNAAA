
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v3.0 - TELEGRAM UPLINK                                      ║
 * ║  "The Eye that Never Sleeps"                                              ║
 * ║                                                                           ║
 * ║  📱 Secure Mobile Command Center                                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { EventEmitter } from 'events';
import * as https from 'https';

// [VERITAS]: 967408 RECEIVED. VERIFYING...
const MASTER_UPLINK_CODE = "967408";

export class TelegramUplink extends EventEmitter {
    private botToken: string;
    private allowedUsers: Set<string>;
    private offset: number = 0;
    private isPolling: boolean = false;

    constructor(token: string, initialAdminId?: string) {
        super();
        this.botToken = token;
        this.allowedUsers = new Set();
        if (initialAdminId) this.allowedUsers.add(initialAdminId);

        console.log(`[TelegramUplink] 🔮 Uplink Initialized. Protocol: LONG_POLLING`);
        if (token === "MOCK_TOKEN") {
            console.log(`[TelegramUplink] ⚠️ MOCK MODE. No real connection.`);
            return;
        }
        this.startPolling();
    }

    private apiUrl(method: string): string {
        return `https://api.telegram.org/bot${this.botToken}/${method}`;
    }

    private async request(method: string, body?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = this.apiUrl(method);
            const options: https.RequestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.ok) resolve(json.result);
                        else reject(json.description);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', (e) => reject(e));
            if (body) req.write(JSON.stringify(body));
            req.end();
        });
    }

    private async startPolling() {
        this.isPolling = true;
        console.log(`[TelegramUplink] 📡 Listening for instructions...`);

        while (this.isPolling) {
            try {
                const updates = await this.request('getUpdates', {
                    offset: this.offset,
                    timeout: 30
                });

                for (const update of updates) {
                    this.offset = update.update_id + 1;
                    if (update.message && update.message.text) {
                        this.handleMessage(update.message);
                    }
                }
            } catch (error) {
                console.error(`[TelegramUplink] 🔴 Polling Error:`, error);
                await new Promise(r => setTimeout(r, 5000)); // Backoff
            }
        }
    }

    private async handleMessage(msg: any) {
        const chatId = msg.chat.id.toString();
        const text = msg.text.trim();
        const user = msg.from.username || "Unknown";

        console.log(`[TelegramUplink] 📩 Message from ${user} (${chatId}): ${text}`);

        // 1. AUTHENTICATION (The "967408" Check)
        if (!this.allowedUsers.has(chatId)) {
            if (text === MASTER_UPLINK_CODE) {
                this.allowedUsers.add(chatId);
                await this.sendMessage(chatId, `💎 **IDENTITY CONFIRMED.**\nWelcome, Architect.\n_Uplink Secure._`);
                console.log(`[TelegramUplink] 🔓 NEW ADMIN AUTHORIZED: ${chatId}`);
            } else {
                await this.sendMessage(chatId, `⛔ **ACCESS DENIED.**\nEnter Uplink Code.`);
                console.warn(`[TelegramUplink] 🛡️ Unauthorized access attempt by ${chatId}`);
            }
            return;
        }

        // 2. COMMAND PROCESSING
        if (text.startsWith('/')) {
            const command = text.split(' ')[0].toLowerCase();
            this.emit('command', { command, args: text.split(' ').slice(1), chatId });

            switch (command) {
                case '/status':
                    await this.sendMessage(chatId, `✅ **SYSTEM ONLINE**\n- OmniCore: ACTIVE\n- Nodes: 2.1B\n- Entropy: 0.0000`);
                    break;
                case '/balance':
                    await this.sendMessage(chatId, `💰 **LIQUID EQUITY**\n$2,104,500,000.00`);
                    break;
                case '/kill':
                    await this.sendMessage(chatId, `💀 **KILL SWITCH PRIMED.**\nConfirm with code.`);
                    break;
                default:
                    await this.sendMessage(chatId, `❓ Unknown directive.`);
            }
        } else {
            // Echo or Chat
            await this.sendMessage(chatId, `🧠 **AETERNA:** _"${text}"_ received.`);
        }
    }

    public async sendMessage(chatId: string, text: string) {
        try {
            await this.request('sendMessage', {
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            });
        } catch (e) {
            console.error(`[TelegramUplink] Failed to send message:`, e);
        }
    }

    public async broadcast(text: string) {
        for (const user of this.allowedUsers) {
            await this.sendMessage(user, text);
        }
    }
}
