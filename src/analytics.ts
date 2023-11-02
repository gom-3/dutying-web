import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { logEvent } from 'firebase/analytics';
import { analytics, hackleClient } from 'initializeApp';

interface Event {
  category: string;
  action: string;
}

export const events = {
  landingPage: {
    header: {
      web: {
        category: 'landingPage',
        action: 'landingPage_header_web',
      },
      mobile: {
        category: 'landingPage',
        action: 'landingPage_header_mobile',
      },
      download: {
        category: 'landingPage',
        action: 'landingPage_header_download',
      },
      ask: {
        category: 'landingPage',
        action: 'landingPage_header_ask',
      },
    },
    footer: {
      partnership: {
        category: 'landingPage',
        action: 'landingPage_footer_partnership',
      },
      question: {
        category: 'landingPage',
        action: 'landingPage_footer_question',
      },
      terms: {
        category: 'landingPage',
        action: 'landingPage_footer_terms',
      },
    },
    demoStart: {
      category: 'landingPage',
      action: 'landingPage_demoStart',
    },
    makeDuty: {
      category: 'landingPage',
      action: 'landingPage_makeDuty',
    },
  },
  makePage: {
    toolbar: {
      openEditWardModal: {
        category: 'makePage',
        action: 'makePage_toolbar_openEditWardModal',
      },
      openShiftInfoModal: {
        category: 'makePage',
        action: 'makePage_toolbar_openShiftInfoModal',
      },
      downloadExcel: {
        category: 'makePage',
        action: 'makePage_toolbar_downloadExcel',
      },
      downloadImage: {
        category: 'makePage',
        action: 'makePage_toolbar_downloadImage',
      },
      changeEditMode: {
        category: 'makePage',
        action: 'makePage_toolbar_changeEditMode',
      },
      editNextMonth: {
        category: 'makePage',
        action: 'makePage_toolbar_editNextMonth',
      },
      changeMonth: {
        category: 'makePage',
        action: 'makePage_toolbar_changeMonth',
      },
      changeShiftTeam: {
        category: 'makePage',
        action: 'makePage_toolbar_changeShiftTeam',
      },
      offLayer: {
        category: 'makePage',
        action: 'makePage_toolbar_offLayer',
      },
      onLayer: {
        category: 'makePage',
        action: 'makePage_toolbar_onLayer',
      },
      undoBytoolbar: {
        category: 'makePage',
        action: 'makePage_toolbar_undoBytoolbar',
      },
      redoByToolbar: {
        category: 'makePage',
        action: 'makePage_toolbar_redoByToolbar',
      },
    },
    panel: {
      changePanelTab: {
        category: 'makePage',
        action: 'makePage_panel_changePanelTab',
      },
      spreadPanel: {
        category: 'makePage',
        action: 'makePage_panel_spreadPanel',
      },
      foldPanel: {
        category: 'makePage',
        action: 'makePage_panel_foldPanel',
      },
      undoByPanel: {
        category: 'makePage',
        action: 'makePage_panel_undoByPanel',
      },
      redoBypanel: {
        category: 'makePage',
        action: 'makePage_panel_redoBypanel',
      },
    },
    editNurseModal: {
      changeNurseName: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseName',
      },
      changeNurseGender: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseGender',
      },
      changeNurseEmploymentDate: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseEmploymentDate',
      },
      changeNursePhone: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNursePhone',
      },
      changeNurseShiftTypes: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseShiftTypes',
      },
      changeNurseIsWorker: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseIsWorker',
      },
      changeNurseIsManager: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseIsManager',
      },
      changeNurseMemo: {
        category: 'makePage',
        action: 'makePage_editNurseModal_changeNurseMemo',
      },
    },
    editWardModal: {
      changeConstraintValue: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeConstraintValue',
      },
      changeConstraintActivation: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeConstraintActivation',
      },
      changeShiftTypeName: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeShiftTypeName',
      },
      changeShiftTypeShortName: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeShiftTypeShortName',
      },
      changeShiftTypeTime: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeShiftTypeTime',
      },
      changeShiftTypeColor: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeShiftTypeColor',
      },
      changeShiftTypeOffType: {
        category: 'makePage',
        action: 'makePage_editWardModal_changeShiftTypeOffType',
      },
      createShiftType: {
        category: 'makePage',
        action: 'makePage_editWardModal_createShiftType',
      },
      editShiftType: {
        category: 'makePage',
        action: 'makePage_editWardModal_editShiftType',
      },
      openEditModal: {
        category: 'makePage',
        action: 'makePage_editWardModal_openEditModal',
      },
    },
    calendar: {
      focusCarried: {
        category: 'makePage',
        action: 'makePage_calendar_focusCarried',
      },
      changeCarried: {
        category: 'makePage',
        action: 'makePage_calendar_changeCarried',
      },
      moveNurse: {
        category: 'makePage',
        action: 'makePage_calendar_moveNurse',
      },
      foldDivision: {
        category: 'makePage',
        action: 'makePage_calendar_foldDivision',
      },
      spreadDivision: {
        category: 'makePage',
        action: 'makePage_calendar_spreadDivision',
      },
      createDivision: {
        category: 'makePage',
        action: 'makePage_calendar_createDivision',
      },
      deleteDivision: {
        category: 'makePage',
        action: 'makePage_calendar_deleteDivision',
      },
      focusCell: {
        category: 'makePage',
        action: 'makePage_calendar_focusCell',
      },
    },
    changeShift: {
      category: 'makePage',
      action: 'makePage_changeShift',
    },
    moveCellFocus: {
      category: 'makePage',
      action: 'makePage_moveCellFocus',
    },
    undoBykey: {
      category: 'makePage',
      action: 'makePage_undoBykey',
    },
    redoBykey: {
      category: 'makePage',
      action: 'makePage_redoBykey',
    },
  },
  requestPage: {
    toolbar: {
      changeMonth: {
        category: 'requestPage',
        action: 'requestPage_toolbar_changeMonth',
      },
      changeShiftTeam: {
        category: 'requestPage',
        action: 'requestPage_toolbar_changeShiftTeam',
      },
      changeEditMode: {
        category: 'makePage',
        action: 'requestPage_toolbar_changeEditMode',
      },
    },
    calendar: {
      focusCarried: {
        category: 'requestPage',
        action: 'requestPage_calendar_focusCarried',
      },
      changeCarried: {
        category: 'requestPage',
        action: 'requestPage_calendar_changeCarried',
      },
      moveNurse: {
        category: 'requestPage',
        action: 'requestPage_calendar_moveNurse',
      },
      foldDivision: {
        category: 'requestPage',
        action: 'requestPage_calendar_foldDivision',
      },
      spreadDivision: {
        category: 'requestPage',
        action: 'requestPage_calendar_spreadDivision',
      },
      createDivision: {
        category: 'requestPage',
        action: 'requestPage_calendar_createDivision',
      },
      deleteDivision: {
        category: 'requestPage',
        action: 'requestPage_calendar_deleteDivision',
      },
      focusCell: {
        category: 'requestPage',
        action: 'requestPage_calendar_focusCell',
      },
    },
    changeShift: {
      category: 'requestPage',
      action: 'requestPage_changeShift',
    },
    moveCellFocus: {
      category: 'requestPage',
      action: 'requestPage_moveCellFocus',
    },
    acceptRequest: {
      category: 'requestPage',
      action: 'requestPage_acceptRequest',
    },
    rejectRequest: {
      category: 'requestPage',
      action: 'requestPage_rejectRequest',
    },
  },
  memberPage: {
    createShiftTeam: {
      category: 'memberPage',
      action: 'memberPage_createShiftTeam',
    },
    moveNurse: {
      category: 'memberPage',
      action: 'memberPage_moveNurse',
    },
    createDivision: {
      category: 'memberPage',
      action: 'memberPage_createDivision',
    },
    deleteDivision: {
      category: 'memberPage',
      action: 'memberPage_deleteDivision',
    },
    openShiftTeamMenu: {
      category: 'memberPage',
      action: 'memberPage_openShiftTeamMenu',
    },
    focusNurse: {
      category: 'memberPage',
      action: 'memberPage_focusNurse',
    },
    moveNurseFocus: {
      category: 'memberPage',
      action: 'memberPage_moveNurseFocus',
    },
    editNurseDrawer: {
      changeNurseName: {
        category: 'memberPage',
        action: 'memberPage_changeNurseName',
      },
      changeNurseGender: {
        category: 'memberPage',
        action: 'memberPage_changeNurseGender',
      },
      changeNurseEmploymentDate: {
        category: 'memberPage',
        action: 'memberPage_changeNurseEmploymentDate',
      },
      changeNursePhone: {
        category: 'memberPage',
        action: 'memberPage_changeNursePhone',
      },
      changeNurseShiftTypes: {
        category: 'memberPage',
        action: 'memberPage_changeNurseShiftTypes',
      },
      changeNurseIsWorker: {
        category: 'memberPage',
        action: 'memberPage_changeNurseIsWorker',
      },
      changeNurseIsManager: {
        category: 'memberPage',
        action: 'memberPage_changeNurseIsManager',
      },
      changeNurseMemo: {
        category: 'memberPage',
        action: 'memberPage_changeNurseMemo',
      },
    },
  },
  navigationBar: {
    foldNavigation: {
      category: 'navigationBar',
      action: 'navigationBar_foldNavigation',
    },
    spreadNavigation: {
      category: 'navigationBar',
      action: 'navigationBar_spreadNavigation',
    },
    navigate: {
      category: 'navigationBar',
      action: 'navigationBar_navigate',
    },
  },
  auth: {
    login: {
      category: 'auth',
      action: 'auth_login',
    },
    logut: {
      category: 'auth',
      action: 'auth_logut',
    },
  },
};

export const sendEvent = (event: Event, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category: event.category,
      action: event.action,
      label,
    });
    ReactPixel.trackCustom(event.action, { label });
    hackleClient.track({ key: event.action, properties: { label } });
    analytics && logEvent(analytics, event.action, { label });
  }
};
