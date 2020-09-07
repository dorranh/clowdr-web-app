import { useContext } from 'react';
import ConferenceContext from '../contexts/ConferenceContext';
import { Conference } from '../classes/Data';
import assert from 'assert';

export function useConference(): Conference {
    let ctx = useContext(ConferenceContext);
    assert(ctx, "Conference should be defined.");
    return ctx;
}
