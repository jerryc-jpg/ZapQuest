import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger';
import auth from './auth';
import cart from './cart';
import station from "./station";
import searchAddress from "./searchAddress"

const store = configureStore({
  middleware: (defaultMiddleware)=> defaultMiddleware().concat(logger),
  reducer:{
    auth: auth,
    cart: cart,
    station:station,
    searchAddress:searchAddress,
  }
});

export default store;
export * from './auth';
export * from './cart';
export * from './station';
export * from './searchAddress';


