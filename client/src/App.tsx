import { Route, Switch } from 'wouter';
import SparkPage from './pages/SparkPage';
import Audiences from './pages/Audiences';

function App() {
  return (
    <Switch>
      <Route path="/" component={SparkPage} />
      <Route path="/audiences" component={Audiences} />
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <a href="/" className="text-blue-600 hover:underline">
              Go back home
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
