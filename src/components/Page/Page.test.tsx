import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import Page from "./Page";
import ConferenceContext from "../../contexts/ConferenceContext";
import UserProfileContext from "../../contexts/UserProfileContext";
import ConferenceSelection from "../Pages/ConferenceSelection/ConferenceSelection";
import Login from "../Pages/Login/Login";
import { Conference, UserProfile } from "../../classes/DataLayer";
import { testData } from "../../tests/setupTests";
import { mocked } from "ts-jest/utils";

jest.mock("../Pages/ConferenceSelection/ConferenceSelection", () => {
    const component = jest.requireActual("../Pages/ConferenceSelection/ConferenceSelection");
    return jest.fn(component.default);
});
jest.mock("../Pages/Login/Login", () => {
    const component = jest.requireActual("../Pages/Login/Login");
    return jest.fn(component.default);
});

describe("Page", () => {
    const mockConferenceSelection = mocked(ConferenceSelection);
    const mockLogin = mocked(Login);

    const PageTestElement = (conference: Conference | null, userProfile: UserProfile | null) =>
        <MemoryRouter>
            <ConferenceContext.Provider value={conference}>
                <UserProfileContext.Provider value={userProfile}>
                    <Page />
                </UserProfileContext.Provider>
            </ConferenceContext.Provider>
        </MemoryRouter>;
    
    const getConference = async () => {
        const conf = await Conference.get(testData.Conference[0].id);
        expect(conf).toBeDefined();
        return conf as Conference;
    };

    let testConference: Conference;

    beforeAll(async () => {
        testConference = await getConference();
    });

    beforeEach(() => {
        mockConferenceSelection.mockClear();
        mockLogin.mockClear();
    });

    it("renders with class name 'page'", () => {
        let element = render(PageTestElement(null, null));

        expect(element.container.children[0].className).toBe("page");
    });

    it("renders the conference selection page", async () => {
        mockConferenceSelection.mockImplementationOnce(() => <></>);

        render(PageTestElement(null, null));

        expect(mockConferenceSelection).toBeCalledTimes(1);
    });

    it("does not render the conference selection page", async () => {
        mockConferenceSelection.mockImplementationOnce(() => <></>);

        render(PageTestElement(testConference, null));

        expect(mockConferenceSelection).toBeCalledTimes(0);
    });

    it("renders the login page", async () => {
        mockLogin.mockImplementationOnce(() => <></>);

        render(PageTestElement(testConference, null));

        expect(mockLogin).toBeCalledTimes(1);
    });
});
