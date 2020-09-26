import React from 'react';
import { Flair } from 'clowdr-db-schema/src/classes/DataLayer';
import "./FlairChip.scss";

interface Props {
    flair: Flair;
    unselected?: boolean;
    small?: boolean;
    onClick?: () => void;
}

export default function FlairChip(props: Props) {
    const f = props.flair;

    const selectedStyles = props.unselected ?
        { background: "none", border: "1px solid " + f.color, color: f.color } :
        { background: f.color, border: "1px solid " + f.color };

    let label = f.label;

    const classes = ["flair-chip"];
    if (props.unselected) {
        classes.push("unselected");
    }
    if (props.onClick) {
        classes.push("has-action");
    }
    if (props.small) {
        label = f.label.match(/\b\w/g)?.join("") ?? f.label;
        classes.push("small");
    }

    return <div
        className={classes.reduce((x, y) => `${x} ${y}`)}
        style={selectedStyles}
        onClick={props.onClick}
        title={f.label}
    >
        <span>{label}</span>
    </div>;
}