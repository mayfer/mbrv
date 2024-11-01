import { MainProps } from 'shared/main_props';
import Demo from './demo/Demo';
import './App.css';

function App(mainProps: MainProps) {
  return (
    <Demo {...mainProps} />
  );
}

export default App;
