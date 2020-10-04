import { UserProfile } from "@clowdr-app/clowdr-db-schema";
import { Paginator } from "twilio-chat/lib/interfaces/paginator";
import { MemberDescriptor } from ".";
import IMember from "./IMember";
import IMessage from "./IMessage";
import { ChannelEventArgs, ChannelEventNames } from "./Services/Twilio/Channel";

export default interface IChannel {
    sid: string;

    membersCount(): Promise<number>;
    members(): Promise<Array<IMember>>;

    getLastReadIndex(): Promise<number | null>;
    setLastReadIndex(value: number | null): Promise<void>;

    inviteUsers(userProfileIds: string[]): Promise<void>;
    declineInvitation(): Promise<void>;

    join(): Promise<void>;

    addMember(userProfile: UserProfile): Promise<IMember>;
    removeMember(member: IMember): Promise<void>;

    getName(): string;
    setName(value: string): Promise<void>;
    getIsDM(): Promise<false | { member1: MemberDescriptor; member2?: MemberDescriptor }>;
    getStatus(): 'invited' | 'joined' | undefined;
    delete(): Promise<void>;

    getMessages(pageSize?: number, anchor?: number, direction?: string): Promise<Paginator<IMessage>>
    sendMessage(message: string): Promise<number>;
    addReaction(messageSid: string, reaction: string): Promise<{ ok: true } | undefined>;
    removeReaction(messageSid: string, reaction: string): Promise<{ ok: true } | undefined>;

    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;

    on: <K extends ChannelEventNames>(event: K, listener: (arg: ChannelEventArgs<K>) => void) => Promise<() => void>;
    off: (event: ChannelEventNames, listener: () => void) => void;
}
