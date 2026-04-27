import AppRouter from "./router/AppRouter.jsx";
import AppProviders from "./providers/AppProviders.jsx";

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
