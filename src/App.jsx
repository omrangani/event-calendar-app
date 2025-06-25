import './App.css'
import Calendar from './Calendar';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Calendar />
      </div>
    </Provider>
  );
}

export default App
