import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider, intlReducer } from 'react-intl-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import injectTapEventPlugin from 'react-tap-event-plugin'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import { addLocaleData } from 'react-intl'
import fr from 'react-intl/locale-data/fr'
import 'intl'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { orange800, cyan700, grey400, cyan800, grey100, grey500, fullBlack} from 'material-ui/styles/colors'

import { saveStore } from 'isotope-client-reduxformv5/entities/fetchEntities.js'
import { fetchUser as fetchUserApi } from 'isotope-client-reduxformv5/login/loginApi'
import { logOut } from 'isotope-client-reduxformv5/login/loginActions'

import * as reducers from './reducers'
import routesFactory from './routes'
import messages from './messages'
import messagesIsotope from 'isotope-client-reduxformv5/messages'


export const muiTheme = getMuiTheme({
	palette: {
		primary1Color: orange800,
		primary2Color: cyan700,
		primary3Color: grey400,
		primary4Color: fullBlack,
		accent1Color: cyan800,
		accent2Color: grey100,
		accent3Color: grey500
	},
	titletoolbar: {
		background: 'white'
	}
})

function reactInit(user) {

	addLocaleData(fr)
	const formats = {
		date: {
			datetime: {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric'
			}
		}
	}

	const enhancers = [
		applyMiddleware(
			thunk,
			promiseMiddleware,
			routerMiddleware(browserHistory)
		)
	]

	if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
		enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
	}

	const store = createStore(combineReducers({
		...reducers,
		form: formReducer,
		routing: routerReducer,
		intl: intlReducer
	}), {
		user,
		intl: {
			locale: 'fr',
			messages: {
				...messages,
				...messagesIsotope
			},
			formats: {
				...formats
			},
			defaultLocale: 'fr',
			defaultFormats: {
				...formats
			}
		}
	}, compose(...enhancers))

	const redirectToLogin = (nextState, replace) => {
		const userState = store.getState().user

		if (!userState.authenticated) {
			replace({
				pathname: '/login',
				state: {
					nextPathname: nextState.location.pathname
				}
			})
		}

	}

	const redirectToAccueil = (nextState, replace) => {
		const userState = store.getState().user
		if (userState.authenticated) {
			replace('/dashboard')
		}
	}

	const logout = () => {
		store.dispatch(logOut())
	}

	// Save store for redirectToLogin
	saveStore(store)

	// Create an enhanced history that syncs navigation events with the store
	const history = syncHistoryWithStore(browserHistory, store)
	const routes = routesFactory(redirectToLogin, redirectToAccueil, logout)

	// Needed for onTouchTap
	// Check this repo:
	// https://github.com/zilverline/react-tap-event-plugin
	injectTapEventPlugin()

	ReactDOM.render(
		<Provider store={store}>
			<MuiThemeProvider muiTheme={muiTheme}>
				<Router history={history} routes={routes} />
			</MuiThemeProvider>
		</Provider>, document.getElementById('app'))
}


const token = window.localStorage.getItem('token')
if (token) {
	fetchUserApi(token).then(user => {
		if (user) {
			user.token = token
			user.authenticated = true
		}
		reactInit(user)
	}).catch((error) => {
		console.log(error)
		reactInit()
	})
} else {
	reactInit()
}
