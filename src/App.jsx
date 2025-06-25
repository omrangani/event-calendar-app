import './App.css'
import Calendar from './Calendar';
import { Provider } from 'react-redux';
import store from './store';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Provider store={store}>
        <div className="min-h-screen bg-gray-50">
          <Calendar />
        </div>
      </Provider>
    </>
  );
}

export default App
