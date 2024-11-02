import { MainProps } from 'shared/main_props';
import Demo from './demo/Demo';

function App(mainProps: MainProps) {
  // mainProps is used to pass initial global state for SSR
  return (
    <Demo {...mainProps} />
  );
}

export default App;
