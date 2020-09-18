import React, { useEffect, useReducer, useRef } from 'react';
import './Sidebar.scss';
import useConference from '../../hooks/useConference';
import useMaybeUserProfile from '../../hooks/useMaybeUserProfile';
import FooterLinks from '../FooterLinks/FooterLinks';
import { Link } from 'react-router-dom';
import MenuExpander, { ButtonSpec } from "./Menu/MenuExpander";
import MenuGroup, { MenuGroupItems } from './Menu/MenuGroup';
import Program from './Program';
import MenuItem from './Menu/MenuItem';
import { ProgramSession, ProgramSessionEvent } from '../../classes/DataLayer';
import { makeCancelable } from '../../classes/Util';

interface Props {
    open: boolean,
    toggleSidebar?: () => void
    doLogout?: () => void
}

type SidebarTasks
    = "loadingSessionsAndEvents";

interface SidebarState {
    tasks: Set<SidebarTasks>;

    chatsIsOpen: boolean;
    roomsIsOpen: boolean;
    programIsOpen: boolean;

    chatSearch: string | null;
    roomSearch: string | null;
    programSearch: string | null;

    sessions: Array<ProgramSession> | null;
    events: Array<ProgramSessionEvent> | null;

    filteredSessions: Array<ProgramSession>;
    filteredEvents: Array<ProgramSessionEvent>;
}

type SidebarUpdate
    = { action: "updateSessions"; sessions: Array<ProgramSession> }
    | { action: "updateEvents"; events: Array<ProgramSessionEvent> }

    | { action: "searchChats"; search: string | null }
    | { action: "searchRooms"; search: string | null }
    | { action: "searchProgram"; search: string | null }

    | { action: "setChatsIsOpen"; isOpen: boolean }
    | { action: "setRoomsIsOpen"; isOpen: boolean }
    | { action: "setProgramIsOpen"; isOpen: boolean }
    ;

function filteredSessionsAndEvents(
    allSessions: Array<ProgramSession>,
    allEvents: Array<ProgramSessionEvent>,
    search: string | null): [Array<ProgramSession>, Array<ProgramSessionEvent>] {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    const endLimit = now;
    const startLimit = now + twoHours;

    let sessions = allSessions
        .filter(x => x.endTime.getTime() >= endLimit
            && x.startTime.getTime() <= startLimit);

    let events = allEvents
        .filter(x => x.endTime.getTime() >= endLimit
            && x.startTime.getTime() <= startLimit);

    let eventsSessionIds = [...new Set(events.map(x => x.sessionId))];

    sessions = sessions.filter(x => !eventsSessionIds.includes(x.id));

    return [sessions, events];
}

function nextSidebarState(currentState: SidebarState, updates: SidebarUpdate | Array<SidebarUpdate>): SidebarState {
    const nextState = {
        tasks: new Set(currentState.tasks),

        chatsIsOpen: currentState.chatsIsOpen,
        roomsIsOpen: currentState.roomsIsOpen,
        programIsOpen: currentState.programIsOpen,

        chatSearch: currentState.chatSearch,
        roomSearch: currentState.roomSearch,
        programSearch: currentState.programSearch,

        sessions: currentState.sessions,
        events: currentState.events,

        filteredSessions: currentState.filteredSessions,
        filteredEvents: currentState.filteredEvents
    };

    let sessionsOrEventsUpdated = false;

    function doUpdate(update: SidebarUpdate) {
        // TODO: Apply update
        switch (update.action) {
            case "searchChats":
                nextState.chatSearch = update.search;
                break;
            case "searchProgram":
                nextState.programSearch = update.search;
                break;
            case "searchRooms":
                nextState.roomSearch = update.search;
                break;
            case "setChatsIsOpen":
                nextState.chatsIsOpen = update.isOpen;
                break;
            case "setProgramIsOpen":
                nextState.programIsOpen = update.isOpen;
                break;
            case "setRoomsIsOpen":
                nextState.roomsIsOpen = update.isOpen;
                break;
            case "updateEvents":
                nextState.events = update.events;
                sessionsOrEventsUpdated = true;
                break;
            case "updateSessions":
                nextState.sessions = update.sessions;
                sessionsOrEventsUpdated = true;
                break;
        }
    }

    if (updates instanceof Array) {
        updates.forEach(doUpdate);
    }
    else {
        doUpdate(updates);
    }

    if (sessionsOrEventsUpdated) {
        if (nextState.sessions && nextState.events) {
            nextState.tasks.delete("loadingSessionsAndEvents");

            const [filteredSessions, filteredEvents]
                = filteredSessionsAndEvents(
                    nextState.sessions,
                    nextState.events,
                    nextState.programSearch
                );
            nextState.filteredSessions = filteredSessions;
            nextState.filteredEvents = filteredEvents;
        }
        else {
            nextState.filteredEvents = [];
            nextState.filteredSessions = [];
        }
    }

    return nextState;
}

function Sidebar(props: Props) {
    const conf = useConference();
    const mUser = useMaybeUserProfile();
    const burgerButtonRef = useRef<HTMLButtonElement>(null);
    const [state, dispatchUpdate] = useReducer(nextSidebarState, {
        tasks: new Set(["loadingSessionsAndEvents"] as SidebarTasks[]),

        chatsIsOpen: true,
        roomsIsOpen: true,
        programIsOpen: true,

        chatSearch: null,
        roomSearch: null,
        programSearch: null,

        sessions: null,
        events: null,

        filteredSessions: [],
        filteredEvents: []
    });

    // TODO: When sidebar is occupying full window (e.g. on mobile), close it
    // when the user clicks a link.

    useEffect(() => {
        burgerButtonRef.current?.focus();
    }, [burgerButtonRef, props.open]);

    // TODO: Use 'M' key as a shortcut to open/close menu?
    // TODO: Use 'C/R/P' to jump focus to menu expanders
    // TODO: Document shortcut keys prominently on the /help page

    // TODO: Introduce a setInterval which refreshes the program view every minute or so
    useEffect(() => {
        let cancel: () => void = () => { };

        async function updateSessionsAndEvents() {
            try {
                const promises: [Promise<Array<ProgramSession>>, Promise<Array<ProgramSessionEvent>>]
                    = [ProgramSession.getAll(conf.id), ProgramSessionEvent.getAll(conf.id)];
                const allPromise = Promise.all(promises);
                const wrappedPromise = makeCancelable(allPromise);
                cancel = wrappedPromise.cancel;

                const [allSessions, allEvents] = await wrappedPromise.promise;

                dispatchUpdate([
                    {
                        action: "updateSessions",
                        sessions: allSessions
                    }, {
                        action: "updateEvents",
                        events: allEvents
                    }]);
            }
            catch (e) {
                if (!e.isCanceled) {

                    dispatchUpdate([
                        {
                            action: "updateSessions",
                            sessions: []
                        }, {
                            action: "updateEvents",
                            events: []
                        }]);

                    throw e;
                }
            }
            finally {
                cancel = () => { };
            }
        }

        updateSessionsAndEvents();

        return cancel;
    }, [conf.id]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            dispatchUpdate({
                action: "searchProgram",
                search: state.programSearch
            });
        }, 1000 * 60 * 3 /* 3 mins */);

        return () => {
            clearInterval(intervalId);
        }
    }, [state.programSearch]);

    let sideBarButton = <div className="sidebar-button">
        <button
            aria-label="Open Menu"
            onClick={props.toggleSidebar}
            className={props.open ? " change" : ""}
            ref={burgerButtonRef}
        >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
        </button>
    </div>;

    if (props.open) {
        // TODO: How much repeat work can we avoid by useEffect where they're
        //       not sensitive to the open - state of each expander

        let sideBarHeading = <h1 aria-level={1}><Link to="/" aria-label="Conference homepage">{conf.shortName}</Link></h1>;
        let headerBar = <div className="sidebar-header">
            {sideBarButton}
            {sideBarHeading}
        </div>

        let mainMenuGroup: JSX.Element = <></>;
        let chatsExpander: JSX.Element = <></>;
        let roomsExpander: JSX.Element = <></>;
        let programExpander: JSX.Element = <></>;

        // TODO: Utilise useCallback for onSearch, onSearchOpen, onSearchClose to reduce rendering
        let chatsButtons: Array<ButtonSpec> = [
            {
                type: "search", label: "Search all chats", icon: "fa-search",
                onSearch: (event) => {
                    dispatchUpdate({ action: "searchChats", search: event.target.value });
                    return event.target.value;
                },
                onSearchOpen: () => {
                    dispatchUpdate({ action: "setChatsIsOpen", isOpen: true });
                },
                onSearchClose: () => {
                    dispatchUpdate({ action: "searchChats", search: null });
                }
            },
            { type: "link", label: "Show all chats", icon: "fa-globe-europe", url: "/chat" },
            { type: "link", label: "Create new chat", icon: "fa-plus", url: "/chat/new" }
        ];
        let roomsButtons: Array<ButtonSpec> = [
            {
                type: "search", label: "Search all rooms", icon: "fa-search",
                onSearch: (event) => {
                    dispatchUpdate({ action: "searchRooms", search: event.target.value });
                    return event.target.value;
                },
                onSearchOpen: () => {
                    dispatchUpdate({ action: "setRoomsIsOpen", isOpen: true });
                },
                onSearchClose: () => {
                    dispatchUpdate({ action: "searchRooms", search: null });
                }
            },
            { type: "link", label: "Show all rooms", icon: "fa-globe-europe", url: "/room" },
            { type: "link", label: "Create new room", icon: "fa-plus", url: "/chat/new" }
        ];
        let programButtons: Array<ButtonSpec> = [
            {
                type: "search", label: "Search whole program", icon: "fa-search",
                onSearch: (event) => {
                    dispatchUpdate({ action: "searchProgram", search: event.target.value });
                    return event.target.value;
                },
                onSearchOpen: () => {
                    dispatchUpdate({ action: "setProgramIsOpen", isOpen: true });
                },
                onSearchClose: () => {
                    dispatchUpdate({ action: "searchProgram", search: null });
                }
            },
            { type: "link", label: "Show whole program", icon: "fa-globe-europe", url: "/program" },
            // TODO: If admin: { type: "link", label: "Create new program event", icon: "fa-plus", url: "/chat/new" }
        ];

        if (mUser) {
            let mainMenuItems: MenuGroupItems = [
                { key: "watched-items", element: <MenuItem title="Watched items" label="Watched items" action="/watched" /> },
                { key: "profile", element: <MenuItem title="Profile" label="Profile" action="/profile" /> },
                { key: "contact-moderators", element: <MenuItem title="Contact moderators" label="Contact moderators" action="/moderators" /> },
                // TODO: If admin: { key: "admin", element: <MenuItem title="Admin tools" label="Admin tools" action="/admin"><></></MenuItem> }
            ];
            mainMenuGroup = <MenuGroup items={mainMenuItems} />;

            // TODO: Generate chat items from database (inc. any current search)
            // TODO: "New messages in this chat" boldification
            // TODO: For DMs, user presence (hollow/solid-green dot)
            let chatMenuItems: MenuGroupItems = [
                {
                    key: "chat-1",
                    element:
                        <MenuItem title="Lobby" label="Lobby chat" icon={<i className="fas fa-hashtag"></i>} action="/chat/1" bold={true} />
                },
                {
                    key: "chat-2",
                    element:
                        <MenuItem title="Haskell Symposium" label="Haskell Symposium chat" icon={<i className="fas fa-hashtag"></i>} action="/chat/2" />
                },
                {
                    key: "chat-3",
                    element:
                        <MenuItem title="Benjamin Pierce" label="Chat with Benjamin Pierce" icon={<i className="fas fa-circle" style={{ color: "green" }}></i>} action="/chat/3" />
                },
                {
                    key: "chat-4",
                    element:
                        <MenuItem title="Crista Lopes" label="Chat with Crista Lopes" icon={<i className="far fa-circle"></i>} action="/chat/4" bold={true} />
                },
            ];
            chatsExpander
                = <MenuExpander
                    title="Chats"
                    isOpen={state.chatsIsOpen}
                    buttons={chatsButtons}
                    onOpenStateChange={() => dispatchUpdate({ action: "setChatsIsOpen", isOpen: !state.chatsIsOpen })}
                >
                    <MenuGroup items={chatMenuItems} />
                </MenuExpander>;

            // TODO: Generate room items from database (inc. any current search)
            let roomMenuItems: MenuGroupItems = [
                {
                    key: "room-1",
                    element:
                        <MenuItem title="Breakout room 1" label="Breakout room 1" icon={<i className="fas fa-video"></i>} action="/room/1">
                            <ul>
                                <li>Benjamin Pierce</li>
                                <li>Crista Lopes</li>
                                <li>Jonathan Bell</li>
                            </ul>
                        </MenuItem>
                },
                {
                    key: "room-2",
                    element:
                        <MenuItem title="Breakout room 2" label="Breakout room 2" icon={<i className="fas fa-video"></i>} action="/room/2">
                            <ul>
                                <li>Ed Nutting</li>
                                <li>Harry Goldstein</li>
                                <li>Alan Turing</li>
                                <li>The one and only SPJ</li>
                                <li>Stephanie Weirich</li>
                            </ul>
                        </MenuItem>
                },
                {
                    key: "room-3",
                    element:
                        <MenuItem title="Large room" label="Large room" icon={<i className="fas fa-video"></i>} action="/room/3">
                            <ul>
                                <li>Alonzo Church</li>
                                <li>Ada Lovelace</li>
                                <li className="plus-bullet">11 more people...</li>
                            </ul>
                        </MenuItem>
                },
            ];
            roomsExpander
                = <MenuExpander
                    title="Rooms"
                    isOpen={state.roomsIsOpen}
                    buttons={roomsButtons}
                    onOpenStateChange={() => dispatchUpdate({ action: "setRoomsIsOpen", isOpen: !state.roomsIsOpen })}
                >
                    <MenuGroup items={roomMenuItems} />
                </MenuExpander>;
        }

        // TODO: Search whole program
        let program: JSX.Element;
        if (state.sessions && state.events) {
            const programTimeBoundaries: Array<number> = [
                0, 15, 30, 60, 120
            ];
            program = <Program
                sessions={state.filteredSessions}
                events={state.filteredEvents}
                timeBoundaries={programTimeBoundaries} />;
        }
        else {
            program = <MenuGroup items={[{
                key: "whole-program",
                element: <MenuItem title="View whole program" label="Whole program" icon={<i className="fas fa-globe-europe"></i>} action="/program" bold={true} />
            }]} />;
        }

        programExpander
            = <MenuExpander
                title="Program"
                isOpen={state.programIsOpen}
                buttons={programButtons}
                onOpenStateChange={() => dispatchUpdate({ action: "setProgramIsOpen", isOpen: !state.programIsOpen })}
            >
                {program}
            </MenuExpander>;

        return <div className="sidebar">
            {headerBar}
            <div className="sidebar-scrollable">
                <div className="menu">
                    {mainMenuGroup}

                    {chatsExpander}

                    {roomsExpander}

                    {programExpander}
                </div>

                <FooterLinks doLogout={mUser ? props.doLogout : undefined} />
            </div>
        </div>;
    }
    else {
        return sideBarButton;
    }
}

export default Sidebar;
