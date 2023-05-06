import type {ClusterClient} from "discord-hybrid-sharding";
import type {Client} from "discord.js";

declare global {

    interface BotClient extends Client {
        cluster?: ClusterClient<unknown>;
    }
}

export {};
