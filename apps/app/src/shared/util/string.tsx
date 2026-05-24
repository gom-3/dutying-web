import {type ReactNode, Fragment} from 'react';
import {v4 as uuidv4} from 'uuid';

export function renderMultilineText(text: string): ReactNode {
    const lines = text.split('\n');

    return lines.map((line, index) => (
        <Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
        </Fragment>
    ));
}

export function generateId() {
    return uuidv4();
}
