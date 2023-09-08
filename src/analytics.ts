import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { logEvent } from 'firebase/analytics';
import { analytics, hackleClient } from 'initializeApp';

interface Event {
  category: string;
  action: string;
}

export const event = {
  change_month: {
    category: 'click',
    action: 'change_month',
  },
  change_shift_team: {
    category: 'select',
    action: 'change_shift_team',
  },
  focus_carried: {
    category: 'click',
    action: 'focus_carried',
  },
  change_carried: {
    category: 'key_down',
    action: 'change_carried',
  },
  move_nurse_md: {
    category: 'drag',
    action: 'move_nurse(md)',
  },
  fold_division: {
    category: 'click',
    action: 'fold_division',
  },
  spread_division: {
    category: 'click',
    action: 'spread_division',
  },
  create_division_md: {
    category: 'click',
    action: 'create_division(md)',
  },
  delete_division_md: {
    category: 'click',
    action: 'delete_division(md)',
  },
  focus_cell: {
    category: 'click',
    action: 'focus_cell',
  },
  change_shift: {
    category: 'key_down',
    action: 'change_shift',
  },
  move_cell_focus: {
    category: 'key_down',
    action: 'move_cell_focus',
  },
  move_cell_focus_end: {
    category: 'key_down',
    action: 'move_cell_focus_end',
  },
  change_panel_tab: {
    category: 'click',
    action: 'change_panel_tab',
  },
  spread_panel: {
    category: 'click',
    action: 'spread_panel',
  },
  fold_panel: {
    category: 'click',
    action: 'fold_panel',
  },
  undo_toolbar: {
    category: 'click',
    action: 'undo(toolbar)',
  },
  undo_key: {
    category: 'key_down',
    action: 'undo(key)',
  },
  undo_panel: {
    category: 'click',
    action: 'undo(panel)',
  },
  redo_toolbar: {
    category: 'click',
    action: 'redo(toolbar)',
  },
  redo_key: {
    category: 'key_down',
    action: 'redo(key)',
  },
  redo_panel: {
    category: 'click',
    action: 'redo(panel)',
  },
  focus_fault: {
    category: 'click',
    action: 'focus_fault',
  },
  off_layer: {
    category: 'click',
    action: 'off_layer',
  },
  on_layer: {
    category: 'click',
    action: 'on_layer',
  },
  open_edit_modal: {
    category: 'click',
    action: 'open_edit_modal',
  },
  move_edit_modal: {
    category: 'drag',
    action: 'move_edit_modal',
  },
  change_constraint_value: {
    category: 'select',
    action: 'change_constraint_value',
  },
  active_constraint: {
    category: 'toggle',
    action: 'active_constraint',
  },
  inactive_constraint: {
    category: 'toggle',
    action: 'inactive_constraint',
  },
  change_shift_type_name: {
    category: 'input_text',
    action: 'change_shift_type_name',
  },
  change_shift_type_short_name: {
    category: 'input_text',
    action: 'change_shift_type_short_name',
  },
  change_shift_type_time: {
    category: 'input_text',
    action: 'change_shift_type_time',
  },
  change_shift_type_color: {
    category: 'input_color',
    action: 'change_shift_type_color',
  },
  change_shift_type_off_type: {
    category: 'toggle',
    action: 'change_shift_type_off_type',
  },
  create_shift_type: {
    category: 'click',
    action: 'create_shift_type',
  },
  edit_shift_type: {
    category: 'click',
    action: 'edit_shift_type',
  },
  open_shift_type_edit_modal: {
    category: 'click',
    action: 'open_shift_type_edit_modal',
  },
  open_shift_info_modal: {
    category: 'click',
    action: 'open_shift_info_modal',
  },
  move_shift_info_modal: {
    category: 'drag',
    action: 'move_shift_info_modal',
  },
  download_excel: {
    category: 'click',
    action: 'download_excel',
  },
  change_month_rq: {
    category: 'click',
    action: 'change_month(rq)',
  },
  change_shift_team_rq: {
    category: 'select',
    action: 'change_shift_team(rq)',
  },
  fold_division_rq: {
    category: 'click',
    action: 'fold_division(rq)',
  },
  spread_division_rq: {
    category: 'click',
    action: 'spread_division(rq)',
  },
  change_shift_rq: {
    category: 'key_down',
    action: 'change_shift(rq)',
  },
  move_focus_rq: {
    category: 'key_down',
    action: 'move_focus(rq)',
  },
  move_focus_end_rq: {
    category: 'key_down',
    action: 'move_focus_end(rq)',
  },
  create_shift_team: {
    category: 'click',
    action: 'create_shift_team',
  },
  move_nurse: {
    category: 'drag',
    action: 'move_nurse',
  },
  create_division: {
    category: 'click',
    action: 'create_division',
  },
  delete_division: {
    category: 'click',
    action: 'delete_division',
  },
  open_shift_team_menu: {
    category: 'click',
    action: 'open_shift_team_menu',
  },
  focus_nurse: {
    category: 'click',
    action: 'focus_nurse',
  },
  move_nurse_focus: {
    category: 'key_down',
    action: 'move_nurse_focus',
  },
  change_nurse_name: {
    category: 'input_text',
    action: 'change_nurse_name',
  },
  change_nurse_gender: {
    category: 'input_text',
    action: 'change_nurse_gender',
  },
  change_nurse_employment_date: {
    category: 'input_text',
    action: 'change_nurse_employment_date',
  },
  change_nurse_phone: {
    category: 'input_text',
    action: 'change_nurse_phone',
  },
  change_nurse_shift_types: {
    category: 'toggle',
    action: 'change_nurse_shift_types',
  },
  change_nurse_is_worker: {
    category: 'toggle',
    action: 'change_nurse_is_worker',
  },
  change_nurse_is_manager: {
    category: 'toggle',
    action: 'change_nurse_is_manager',
  },
  change_nurse_memo: {
    category: 'input_text',
    action: 'change_nurse_memo',
  },
  fold_navigation: {
    category: 'click',
    action: 'fold_navigation',
  },
  spread_navigation: {
    category: 'click',
    action: 'spread_navigation',
  },
  navigate: {
    category: 'click',
    action: 'navigate',
  },
  login: {
    category: 'auth',
    action: 'login',
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
