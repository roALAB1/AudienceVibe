import { Route, Switch, Redirect } from 'wouter';
import DashboardLayout from './components/DashboardLayout';
import SparkPage from './pages/SparkPage';
import AudiencesPage from './pages/AudiencesPage';
import PixelsPage from './pages/PixelsPage';
import EnrichmentsPage from './pages/EnrichmentsPage';
import ChangelogPage from './pages/ChangelogPage';

function App() {
  return (
    <DashboardLayout>
      <Switch>
        {/* Redirect home to Spark V2 */}
        <Route path="/">
          {() => <Redirect to="/spark" />}
        </Route>
        
        {/* Main routes */}
        <Route path="/spark" component={SparkPage} />
        <Route path="/audiences" component={AudiencesPage} />
        <Route path="/pixels" component={PixelsPage} />
        <Route path="/enrichments" component={EnrichmentsPage} />
        <Route path="/changelog" component={ChangelogPage} />
        
        {/* 404 fallback */}
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <a href="/spark" className="text-blue-600 hover:underline">
                Go to Spark V2
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </DashboardLayout>
  );
}

export default App;
