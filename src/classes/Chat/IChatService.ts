import { Conference, UserProfile } from "@clowdr-app/clowdr-db-schema";
import IChannel from "./IChannel";

export default interface IChatService {
    setup(conference: Conference, userProfile: UserProfile, sessionToken: string): Promise<void>;
    teardown(): Promise<void>;

    allChannels(): Promise<Array<IChannel>>;
    activeChannels(): Promise<Array<IChannel>>;

    getChannel(channelSid: string): Promise<IChannel>;

    createChannel(invite: Array<string>, isPrivate: boolean, title: string): Promise<IChannel>;

    enableAutoRenewConnection(): Promise<void>;
    enableAutoJoinOnInvite(): Promise<void>;
}
