import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import newStore from './modals/New/store';

const initial = {
  file: {
    isOpen: false,
    label: 'File',
    menuItems: {
      close: {
        clickHandler: async () => goto('/label-matrix/view-edit'),
        disabled: true,
        keyboardControl: {
          ctrlKey: true,
          key: 'w',
          shiftKey: false
        },
        label: 'Close'
      },
      delete: {
        clickHandler: async () => {},
        disabled: true,
        keyboardControl: {
          ctrlKey: true,
          key: 'd',
          shiftKey: false
        },
        label: 'Delete'
      },
      new: {
        clickHandler: async () => {
          newStore.update((state) => {
            state.isOpen = true;
            return state;
          });
        },
        disabled: false,
        keyboardControl: {
          ctrlKey: true,
          key: 'n',
          shiftKey: false
        },
        label: 'New'
      },
      open: {
        clickHandler: async () => {},
        disabled: false,
        keyboardControl: {
          ctrlKey: true,
          key: 'o',
          shiftKey: false
        },
        label: 'Open'
      },
      print: {
        clickHandler: async () => {},
        disabled: true,
        keyboardControl: {
          ctrlKey: true,
          key: 'p',
          shiftKey: false
        },
        label: 'Print'
      },
      save: {
        clickHandler: async () => {},
        disabled: true,
        keyboardControl: {
          ctrlKey: true,
          key: 's',
          shiftKey: false
        },
        label: 'Save'
      },
      saveAs: {
        clickHandler: async () => {},
        disabled: true,
        keyboardControl: {
          ctrlKey: true,
          key: 's',
          shiftKey: true
        },
        label: 'Save As'
      }
    }
  }
};

const createStore = () => {
  // destructure base methods
  const { set, subscribe, update } = writable(initial);

  return {
    set,
    subscribe,
    update
  };
};

export default createStore();
