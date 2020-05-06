import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/Store';

import 'tachyons';
import './styles/index.css';

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
