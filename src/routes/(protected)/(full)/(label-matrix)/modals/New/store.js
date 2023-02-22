import { writable } from 'svelte/store';

export default writable({
  height: 1,
  isOpen: false,
  name: '',
  width: 3
});
