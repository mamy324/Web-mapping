


/*import React, { useState } from "react";

import Sidebar from "./Sidebar";

import Map from "./map/Map";
import Logement from "./map/Logement";
import Loyer from "./map/Loyer";
import CoutEau from "./map/couteau";
import Securite from "./map/Securite";
import Eau from "./map/Eau";
import Electricite from "./map/Electricite";

import CoutElectricite from "./map/Facture";
import Toilette from "./Toilette";
import EtatToilette from "./map/Etat"; // AJOUT



function App() {

const [maxTotal,setMaxTotal]=useState("");

const [selectedLogement,setSelectedLogement]=useState([]);
const [selectedSecurite,setSelectedSecurite]=useState([]);
const [selectedEau,setSelectedEau]=useState([]);
const [selectedElectricite,setSelectedElectricite]=useState([]);

const [selectedToilette,setSelectedToilette]=useState([]);
const [selectedEtatToilette,setSelectedEtatToilette]=useState([]); // AJOUT

const [showLoyer,setShowLoyer]=useState(false);
const [showEauCost,setShowEauCost]=useState(false);
const [showElectriciteCost,setShowElectriciteCost]=useState(false);

const [prixRange,setPrixRange]=useState([0,100000]);
const [eauRange,setEauRange]=useState([0,20000]);

return(

<div style={{display:"flex"}}>

<Sidebar

maxTotal={maxTotal}
setMaxTotal={setMaxTotal}

selectedLogement={selectedLogement}
setSelectedLogement={setSelectedLogement}

selectedSecurite={selectedSecurite}
setSelectedSecurite={setSelectedSecurite}

selectedEau={selectedEau}
setSelectedEau={setSelectedEau}

selectedElectricite={selectedElectricite}
setSelectedElectricite={setSelectedElectricite}

selectedToilette={selectedToilette}
setSelectedToilette={setSelectedToilette}

selectedEtatToilette={selectedEtatToilette}          // AJOUT
setSelectedEtatToilette={setSelectedEtatToilette}    // AJOUT

prixRange={prixRange}
setPrixRange={setPrixRange}

eauRange={eauRange}
setEauRange={setEauRange}

setShowLoyer={setShowLoyer}
setShowEauCost={setShowEauCost}
setShowElectriciteCost={setShowElectriciteCost}

/>

<div style={{flexGrow:1}}>

{showLoyer?(

<Loyer prixRange={prixRange}/>

):showEauCost?(

<CoutEau eauRange={eauRange}/>

):showElectriciteCost?(

<CoutElectricite selectedTypes={selectedElectricite}/>

):selectedEtatToilette.length>0?(   // AJOUT

<EtatToilette selectedTypes={selectedEtatToilette}/>

):selectedToilette.length>0?(

<Toilette selectedTypes={selectedToilette}/>

):selectedSecurite.length>0?(

<Securite selectedTypes={selectedSecurite}/>

):selectedEau.length>0?(

<Eau selectedTypes={selectedEau}/>

):selectedElectricite.length>0?(

<Electricite selectedTypes={selectedElectricite}/>

):selectedLogement.length>0?(

<Logement selectedTypes={selectedLogement}/>

):( 

<Map maxTotal={maxTotal}/>

)}

</div>

</div>

);

}

export default App;*/


import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./Sidebar";

import Map from "./map/Map";
import Logement from "./map/Logement";
import Loyer from "./map/Loyer";
import CoutEau from "./map/couteau";
import Securite from "./map/Securite";
import Eau from "./map/Eau";
import Electricite from "./map/Electricite";

import CoutElectricite from "./map/Facture";
import Toilette from "./Toilette";
import EtatToilette from "./map/Etat";

function App() {

///////
const [user,setUser] = useState(null);

useEffect(()=>{

const token = localStorage.getItem("token");

axios.get(
"http://localhost:8000/api/user",
{
headers:{
authorization:token
}
}
).then(res=>{
setUser(res.data);
});

},[]);




//////

const [maxTotal,setMaxTotal]=useState("");

const [selectedLogement,setSelectedLogement]=useState([]);
const [selectedSecurite,setSelectedSecurite]=useState([]);
const [selectedEau,setSelectedEau]=useState([]);
const [selectedElectricite,setSelectedElectricite]=useState([]);

const [selectedToilette,setSelectedToilette]=useState([]);
const [selectedEtatToilette,setSelectedEtatToilette]=useState([]);

const [showLoyer,setShowLoyer]=useState(false);
const [showEauCost,setShowEauCost]=useState(false);
const [showElectriciteCost,setShowElectriciteCost]=useState(false);

const [prixRange,setPrixRange]=useState([0,100000]);
const [eauRange,setEauRange]=useState([0,20000]);

return(

<div style={{display:"flex"}}>

<Sidebar

maxTotal={maxTotal}
setMaxTotal={setMaxTotal}

selectedLogement={selectedLogement}
setSelectedLogement={setSelectedLogement}

selectedSecurite={selectedSecurite}
setSelectedSecurite={setSelectedSecurite}

selectedEau={selectedEau}
setSelectedEau={setSelectedEau}

selectedElectricite={selectedElectricite}
setSelectedElectricite={setSelectedElectricite}

selectedToilette={selectedToilette}
setSelectedToilette={setSelectedToilette}

selectedEtatToilette={selectedEtatToilette}
setSelectedEtatToilette={setSelectedEtatToilette}

prixRange={prixRange}
setPrixRange={setPrixRange}

eauRange={eauRange}
setEauRange={setEauRange}

setShowLoyer={setShowLoyer}
setShowEauCost={setShowEauCost}
setShowElectriciteCost={setShowElectriciteCost}

/>

<div style={{flexGrow:1}}>

{showLoyer?(

<Loyer prixRange={prixRange}/>

):showEauCost?(

<CoutEau eauRange={eauRange}/>

):showElectriciteCost?(

<CoutElectricite selectedTypes={selectedElectricite}/>

):selectedEtatToilette.length>0?(

<EtatToilette selectedTypes={selectedEtatToilette}/>

):selectedToilette.length>0?(

<Toilette selectedTypes={selectedToilette}/>

):selectedSecurite.length>0?(

<Securite selectedTypes={selectedSecurite}/>

):selectedEau.length>0?(

<Eau selectedTypes={selectedEau}/>

):selectedElectricite.length>0?(

<Electricite selectedTypes={selectedElectricite}/>

):selectedLogement.length>0?(

<Logement selectedTypes={selectedLogement}/>

):( 

<Map maxTotal={maxTotal}/>

)}

</div>

</div>

);

}

export default App;



