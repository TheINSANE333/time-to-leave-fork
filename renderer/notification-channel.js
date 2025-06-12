'use strict';

import IpcConstants from '../js/ipc-constants.mjs';

const searchLeaveByElement = (event) =>
{
    const leaveByElement = $('#leave-by').val();
    if (event && event.sender && event.sender.send) {
        event.sender.send(IpcConstants.ReceiveLeaveBy, leaveByElement);
    }
    return leaveByElement;
};

export {
    searchLeaveByElement
};
