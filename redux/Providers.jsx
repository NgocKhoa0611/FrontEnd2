import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./store";

function Providers({ children }) {
    return (
        <Provider store={store}>
            <Router>
                {children}
            </Router>
        </Provider>
    );
}

export default Providers;
