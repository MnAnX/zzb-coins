import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

const loggerMiddleware = createLogger({colors: false});
let middleware = [thunkMiddleware, loggerMiddleware];

export default function configureStore() {
   const store = createStore(rootReducer, undefined, compose(
       applyMiddleware(...middleware),
      )
   );

   persistStore(store, null);

   return store;
};
