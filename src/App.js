import EnergyDashboard from './comps/EnergyDashboard';
import EnergyDistribution from './comps/EnergyDistribution';
import './App.css';
import logo from "./Switchy-Logo.png"
import profile from "./profile.png"

function App() {
  return (
    <div className="App">
      <nav>
      <div className='profileCon'>
       <img className="logo" src={logo}/>
       <h1>Switchy</h1>
       </div>
       <div className='profileCon'>
       <img className="profile" src={profile} onClick={()=> alert("Under Construction")}/>
       </div>
      </nav>
      <h1 className='dash'>Dashboard</h1>
      <div className='graphs'>
      <div className='graph1'>
  <EnergyDashboard/>
</div>
<div className='graph1'>
  <EnergyDistribution/>
</div>

      </div>
    </div>
  );
}

export default App;
