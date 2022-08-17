// imports
import { writable } from 'svelte/store';

// initial value
const initialValue = {
  PackageInfo: {
    Packages: '1',
    Weight: '30'
  },
  Shipper: {
    AddressLine: '3177 Lehigh Street',
    City: 'Caledonia',
    StateProvinceCode: 'NY',
    PostalCode: '14423',
    CountryCode: 'US'
  },
  ShipTo: {
    AddressLine: '',
    City: '',
    StateProvinceCode: '',
    PostalCode: '',
    CountryCode: 'US'
  }
};

export default writable(initialValue);
