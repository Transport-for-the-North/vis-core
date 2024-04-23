import './App.css';
import MapLayout from 'Components/MapLayout';
import { Dashboard } from 'layouts';

function App() {
  return (
    <div className="App">
      <Dashboard>
        <MapLayout />
      </Dashboard>
    </div>
  );
}

export default App;
