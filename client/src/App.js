import "./App.css";
import UserRegistration from "./components/UserRegistration";
import UserLogin from "./components/UserLogin";
import UserValidation from "./components/UserValidation";
import UserProfile from "./components/UserProfile";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	NavLink,
} from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<NavLink to="/userRegistration">Register</NavLink>
				<NavLink to="/userLogin">Login</NavLink>
				<NavLink to="/userProfile">Validation</NavLink>

				<Switch>
					<Route path="/userRegistration">
						<UserRegistration />
					</Route>
					<Route path="/userLogin">
						<UserLogin />
					</Route>
					<Route path="/userValidation">
						<UserValidation />
					</Route>
					<Route path="/userProfile">
						<UserProfile />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
