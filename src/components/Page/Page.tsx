import React from 'react';
import './Page.scss';
import useMaybeConference from '../../hooks/useMaybeConference';
import ConferenceSelection, { selectConferenceF } from '../Pages/ConferenceSelection/ConferenceSelection';
import Login, { doLoginF } from '../Pages/Login/Login';
import useMaybeUserProfile from '../../hooks/useMaybeUserProfile';
import LoggedInWelcome from '../Pages/LoggedInWelcome/LoggedInWelcome';

interface Props {
    doLogin: doLoginF;
    selectConference: selectConferenceF;
}

function Page(props: Props) {
    const mConf = useMaybeConference();
    const mUser = useMaybeUserProfile();

    let contentsElem: JSX.Element;
    if (mConf && mUser) {
        contentsElem = <LoggedInWelcome />;
    }
    else if (mConf) {
        contentsElem = <Login doLogin={props.doLogin} />;
    }
    else {
        contentsElem = <ConferenceSelection selectConference={props.selectConference} />;
    }

    return <div className="page">
        {contentsElem}
    </div>;
}

export default Page;
