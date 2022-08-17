// imports
import { writable } from 'svelte/store';

// initial value
const initialValue = {
  current: 0,
  number: 10
};

export default writable(initialValue);
