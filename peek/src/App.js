import logo from './logo.svg';
import './App.scss';
import {TBA} from "./TBA";
import {TeamModifier} from "./TeamModifier"
import {ContextMenu} from "./ContextMenu"


function App() {


/*

      <header className="App-header">
      
      </header>
*/

  
  return (
    <div className="App">
      <body>
        <TeamModifier />
        
        <TBA />
      </body>
    </div>
  );
}

export default App;
