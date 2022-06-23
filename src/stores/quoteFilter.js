// imports
import { writable } from 'svelte/store';

// initial value
const initialValue = {
  classification: '',
  dateFrom: '',
  dateTo: '',
  quote: '',
  shipTo: {
    AddressLine: '',
    City: '',
    StateProvinceCode: '',
    PostalCode: ''
  }
};

export default writable(initialValue);
