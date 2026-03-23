


/*import React, { useState } from "react";
import {
Drawer,List,ListItem,ListItemIcon,ListItemText,
IconButton,Typography,Divider,Box,ListItemButton,
Collapse,Checkbox,TextField,InputAdornment,Slider
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import BoltIcon from "@mui/icons-material/Bolt";
import WcIcon from "@mui/icons-material/Wc";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

const drawerWidth = 240;

export default function Sidebar({

maxTotal,setMaxTotal,

selectedLogement,setSelectedLogement,
selectedSecurite,setSelectedSecurite,
selectedEau,setSelectedEau,
selectedElectricite,setSelectedElectricite,
selectedToilette,setSelectedToilette,


selectedEtatToilette,
setSelectedEtatToilette,

prixRange,setPrixRange,
eauRange,setEauRange,

setShowLoyer,setShowEauCost,
setShowElectriciteCost

}){

const [open,setOpen]=useState(true);
const [openMenus,setOpenMenus]=useState({});
const [checkedItems,setCheckedItems]=useState({});
const [filterText,setFilterText]=useState("");

const toggleDrawer=()=>setOpen(!open);

const logementTypes=[
{value:"location",label:"Location"},
{value:"colocation",label:"Colocation"},
{value:"famille",label:"Famille"},
{value:"cite",label:"Cité"}
];

const electriciteTypes=[
{value:"jiramae",label:"Jirama"},
{value:"groupe1",label:"Groupe"},
{value:"autre1",label:"aucun"}
];

const securiteTypes=["securisé","securité moyenne","peu securisé"];
const eauTypes=["jirama","puits","pompe"];

const coutElectriciteTypes=[
"gratuit",
"abordable",
"assez cher",
"tres cher"
];

const typeToiletteTypes=[
"traditionnelle",
"moderne",
"commune"
];

const etatToiletteTypes=[
"bon",
"moyen",
"mauvais"
];



const handleToggleMenu=(menu)=>{

setOpenMenus(prev=>({...prev,[menu]:!prev[menu]}));

setShowLoyer(false);
setShowEauCost(false);
setShowElectriciteCost(false);


setSelectedToilette([]);
setSelectedEtatToilette([]);

if(menu==="Type de logement"){

const values=logementTypes.map(t=>t.value);

setSelectedLogement(values);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
values.forEach(t=>checked[`Type de logement-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Sécurité"){

setSelectedSecurite(securiteTypes);
setSelectedLogement([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
securiteTypes.forEach(t=>checked[`Sécurité-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Eau"){

setSelectedEau(eauTypes);
setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedElectricite([]);

let checked={};
eauTypes.forEach(t=>checked[`Eau-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Electricité"){

const values = electriciteTypes.map(t => t.value);

setSelectedElectricite(values);
setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);

let checked={};
values.forEach(t=>checked[`Electricité-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Coût logement"){
setShowLoyer(true);
}

if(menu==="Coût eau"){
setShowEauCost(true);
}

if(menu==="Coût électricité"){

setShowElectriciteCost(true);

const values = coutElectriciteTypes;

setSelectedElectricite(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);

let checked={};
values.forEach(t=>{
checked[`Coût électricité-${t}`]=true;
});

setCheckedItems(checked);

}



if(menu==="Types de toilette"){

const values=typeToiletteTypes;

setSelectedToilette(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
values.forEach(t=>checked[`Types de toilette-${t}`]=true);
setCheckedItems(checked);

}



if(menu==="Etat de toilette"){

const values=etatToiletteTypes;

setSelectedEtatToilette(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);
setSelectedToilette([]);

let checked={};
values.forEach(t=>checked[`Etat de toilette-${t}`]=true);
setCheckedItems(checked);

}

};



const handleCheck=(menu,value)=>{

const key=`${menu}-${value}`;
const newChecked=!checkedItems[key];

setCheckedItems(prev=>({...prev,[key]:newChecked}));

if(menu==="Type de logement"){

if(newChecked){
setSelectedLogement(prev=>[...prev,value]);
}else{
setSelectedLogement(prev=>prev.filter(t=>t!==value));
}

}

if(menu==="Sécurité"){

if(newChecked){
setSelectedSecurite(prev=>[...prev,value]);
}else{
setSelectedSecurite(prev=>prev.filter(t=>t!==value));
}

}

if(menu==="Eau"){

if(newChecked){
setSelectedEau(prev=>[...prev,value]);
}else{
setSelectedEau(prev=>prev.filter(t=>t!==value));
}

}

if(menu==="Electricité"){

if(newChecked){
setSelectedElectricite(prev=>[...prev,value]);
}else{
setSelectedElectricite(prev=>prev.filter(t=>t!==value));
}

}

if(menu==="Coût électricité"){

if(newChecked){
setSelectedElectricite(prev=>[...prev,value]);
}else{
setSelectedElectricite(prev=>prev.filter(t=>t!==value));
}

}


if(menu==="Types de toilette"){

if(newChecked){
setSelectedToilette(prev=>[...prev,value]);
}else{
setSelectedToilette(prev=>prev.filter(t=>t!==value));
}

}



if(menu==="Etat de toilette"){

if(newChecked){
setSelectedEtatToilette(prev=>[...prev,value]);
}else{
setSelectedEtatToilette(prev=>prev.filter(t=>t!==value));
}

}

};

const menuItems=[

{text:"Type de logement",icon:<ApartmentIcon/>,types:logementTypes},

{text:"Coût logement",icon:<MonetizationOnIcon/>,slider:true},

{text:"Sécurité",icon:<SecurityIcon/>,types:securiteTypes},

{text:"Eau",icon:<WaterDropIcon/>,types:eauTypes},

{text:"Coût eau",icon:<PaidIcon/>,sliderEau:true},

{text:"Electricité",icon:<ElectricBoltIcon/>,types:electriciteTypes},

{text:"Coût électricité",icon:<BoltIcon/>,types:coutElectriciteTypes},

{text:"Types de toilette",icon:<WcIcon/>,types:typeToiletteTypes},

{text:"Etat de toilette",icon:<CleaningServicesIcon/>,types:etatToiletteTypes}

];

return(

<Box sx={{display:"flex"}}>

<Drawer
variant="permanent"
sx={{
width:open?drawerWidth:70,
"& .MuiDrawer-paper":{
width:open?drawerWidth:70,
background:"#1e293b",
color:"#fff"
}
}}
>

<Box sx={{display:"flex",justifyContent:"space-between",p:1}}>

{open&&<Typography variant="h6">Logement_Etudiant</Typography>}

<IconButton onClick={toggleDrawer} sx={{color:"#fff"}}>
{open?<ChevronLeftIcon/>:<MenuIcon/>}
</IconButton>

</Box>

<Divider/>

<Box sx={{p:1}}>

<TextField
fullWidth
size="small"
type="number"
placeholder="Population Etudiante"
value={filterText}
onChange={(e)=>{
setFilterText(e.target.value);
setMaxTotal(e.target.value);
}}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<FilterAltIcon sx={{color:"#cbd5e1"}}/>
</InputAdornment>
)
}}
sx={{background:"#334155",borderRadius:1,input:{color:"#fff"}}}
/>

</Box>

<List>

{menuItems.map((item,i)=>(

<Box key={i}>

<ListItem disablePadding>

<ListItemButton onClick={()=>handleToggleMenu(item.text)}>

<ListItemIcon sx={{color:"#cbd5e1"}}>
{item.icon}
</ListItemIcon>

{open&&<ListItemText primary={item.text}/>}

{open&&(openMenus[item.text]?<ExpandLess/>:<ExpandMore/>)}

</ListItemButton>

</ListItem>

<Collapse in={openMenus[item.text]}>

<List component="div" disablePadding>

{item.types && item.types.map((sub,j)=>{

const value=sub.value||sub;
const label=sub.label||sub;
const key=`${item.text}-${value}`;

return(

<ListItem key={j} disablePadding>

<ListItemButton sx={{pl:6}} onClick={()=>handleCheck(item.text,value)}>

<Checkbox checked={checkedItems[key]||false} sx={{color:"#cbd5e1"}}/>

<ListItemText primary={label}/>

</ListItemButton>

</ListItem>

);

})}

{item.slider && (
<Box sx={{px:3,py:2}}>
<Slider
value={prixRange}
onChange={(e,newValue)=>setPrixRange(newValue)}
valueLabelDisplay="auto"
min={0}
max={100000}
step={10000}
sx={{color:"#38bdf8"}}
/>
</Box>
)}

{item.sliderEau && (
<Box sx={{px:3,py:2}}>
<Slider
value={eauRange}
onChange={(e,newValue)=>setEauRange(newValue)}
valueLabelDisplay="auto"
min={0}
max={20000}
step={1000}
sx={{color:"#22c55e"}}
/>
</Box>
)}

</List>

</Collapse>

</Box>

))}
</List>

</Drawer>

</Box>

);

}
*/

import React, { useState } from "react";
import {
Drawer,List,ListItem,ListItemIcon,ListItemText,
IconButton,Typography,Divider,Box,ListItemButton,
Collapse,Checkbox,TextField,InputAdornment,Slider,
Avatar,Menu,MenuItem
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from "@mui/icons-material/Paid";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import BoltIcon from "@mui/icons-material/Bolt";
import WcIcon from "@mui/icons-material/Wc";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

const drawerWidth = 240;

export default function Sidebar({

maxTotal,setMaxTotal,

selectedLogement,setSelectedLogement,
selectedSecurite,setSelectedSecurite,
selectedEau,setSelectedEau,
selectedElectricite,setSelectedElectricite,
selectedToilette,setSelectedToilette,

selectedEtatToilette,
setSelectedEtatToilette,

prixRange,setPrixRange,
eauRange,setEauRange,

setShowLoyer,setShowEauCost,
setShowElectriciteCost

}){

const [open,setOpen]=useState(true);
const [openMenus,setOpenMenus]=useState({});
const [checkedItems,setCheckedItems]=useState({});
const [filterText,setFilterText]=useState("");
const [anchorEl,setAnchorEl]=useState(null);

const navigate = useNavigate();

const [user,setUser] = useState({
name:"",
initials:""
});

const toggleDrawer=()=>setOpen(!open);

const handleUserMenu=(event)=>{
setAnchorEl(event.currentTarget);
};

const handleCloseUserMenu=()=>{
setAnchorEl(null);
};

const logout=()=>{
localStorage.removeItem("token");
window.location.href="/";
};

const adminLogin=()=>{
navigate("/admin");
};

const logementTypes=[
{value:"location",label:"Location"},
{value:"colocation",label:"Colocation"},
{value:"famille",label:"Famille"},
{value:"cite",label:"Cité"}
];

const electriciteTypes=[
{value:"jiramae",label:"Jirama"},
{value:"groupe1",label:"Groupe"},
{value:"autre1",label:"aucun"}
];

const securiteTypes=["securisé","securité moyenne","peu securisé"];
const eauTypes=["jirama","puits","pompe"];

const coutElectriciteTypes=[
"gratuit",
"abordable",
"assez cher",
"tres cher"
];

const typeToiletteTypes=[
"traditionnelle",
"moderne",
"commune"
];

const etatToiletteTypes=[
"bon",
"moyen",
"mauvais"
];

const handleToggleMenu=(menu)=>{

setOpenMenus(prev=>({...prev,[menu]:!prev[menu]}));

setShowLoyer(false);
setShowEauCost(false);
setShowElectriciteCost(false);

setSelectedToilette([]);
setSelectedEtatToilette([]);

if(menu==="Type de logement"){

const values=logementTypes.map(t=>t.value);

setSelectedLogement(values);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
values.forEach(t=>checked[`Type de logement-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Sécurité"){

setSelectedSecurite(securiteTypes);
setSelectedLogement([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
securiteTypes.forEach(t=>checked[`Sécurité-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Eau"){

setSelectedEau(eauTypes);
setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedElectricite([]);

let checked={};
eauTypes.forEach(t=>checked[`Eau-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Electricité"){

const values = electriciteTypes.map(t => t.value);

setSelectedElectricite(values);
setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);

let checked={};
values.forEach(t=>checked[`Electricité-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Coût logement"){
setShowLoyer(true);
}

if(menu==="Coût eau"){
setShowEauCost(true);
}

if(menu==="Coût électricité"){

setShowElectriciteCost(true);

const values = coutElectriciteTypes;

setSelectedElectricite(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);

let checked={};
values.forEach(t=>{
checked[`Coût électricité-${t}`]=true;
});

setCheckedItems(checked);

}

if(menu==="Types de toilette"){

const values=typeToiletteTypes;

setSelectedToilette(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);

let checked={};
values.forEach(t=>checked[`Types de toilette-${t}`]=true);
setCheckedItems(checked);

}

if(menu==="Etat de toilette"){

const values=etatToiletteTypes;

setSelectedEtatToilette(values);

setSelectedLogement([]);
setSelectedSecurite([]);
setSelectedEau([]);
setSelectedElectricite([]);
setSelectedToilette([]);

let checked={};
values.forEach(t=>checked[`Etat de toilette-${t}`]=true);
setCheckedItems(checked);

}

};

const handleCheck=(menu,value)=>{

const key=`${menu}-${value}`;
const newChecked=!checkedItems[key];

setCheckedItems(prev=>({...prev,[key]:newChecked}));

if(menu==="Type de logement"){
newChecked
? setSelectedLogement(prev=>[...prev,value])
: setSelectedLogement(prev=>prev.filter(t=>t!==value));
}

if(menu==="Sécurité"){
newChecked
? setSelectedSecurite(prev=>[...prev,value])
: setSelectedSecurite(prev=>prev.filter(t=>t!==value));
}

if(menu==="Eau"){
newChecked
? setSelectedEau(prev=>[...prev,value])
: setSelectedEau(prev=>prev.filter(t=>t!==value));
}

if(menu==="Electricité"){
newChecked
? setSelectedElectricite(prev=>[...prev,value])
: setSelectedElectricite(prev=>prev.filter(t=>t!==value));
}

if(menu==="Coût électricité"){
newChecked
? setSelectedElectricite(prev=>[...prev,value])
: setSelectedElectricite(prev=>prev.filter(t=>t!==value));
}

if(menu==="Types de toilette"){
newChecked
? setSelectedToilette(prev=>[...prev,value])
: setSelectedToilette(prev=>prev.filter(t=>t!==value));
}

if(menu==="Etat de toilette"){
newChecked
? setSelectedEtatToilette(prev=>[...prev,value])
: setSelectedEtatToilette(prev=>prev.filter(t=>t!==value));
}

};

const menuItems=[

{text:"Type de logement",icon:<ApartmentIcon/>,types:logementTypes},

{text:"Coût logement",icon:<MonetizationOnIcon/>,slider:true},

{text:"Sécurité",icon:<SecurityIcon/>,types:securiteTypes},

{text:"Eau",icon:<WaterDropIcon/>,types:eauTypes},

{text:"Coût eau",icon:<PaidIcon/>,sliderEau:true},

{text:"Electricité",icon:<ElectricBoltIcon/>,types:electriciteTypes},

{text:"Coût électricité",icon:<BoltIcon/>,types:coutElectriciteTypes},

{text:"Types de toilette",icon:<WcIcon/>,types:typeToiletteTypes},

{text:"Etat de toilette",icon:<CleaningServicesIcon/>,types:etatToiletteTypes}

];
////////////////////////
useEffect(() => {
  const loadUser = async () => {
    // Gestion du token venant de Google
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      // On ne log RIEN pour les 401 → plus d'erreur dans la console
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      // Pour les autres erreurs (500, network, etc.), on log
      else {
        console.error("Erreur utilisateur :", err);
      }
    }
  };

  loadUser();
}, []);
/////////////////////////

return(

<Box sx={{display:"flex"}}>

<Drawer
variant="permanent"
sx={{
width:open?drawerWidth:70,
"& .MuiDrawer-paper":{
width:open?drawerWidth:70,
background:"#1e293b",
color:"#fff",
display:"flex",
flexDirection:"column"
}
}}
>

<Box sx={{display:"flex",justifyContent:"space-between",p:1}}>

{open&&<Typography variant="h6">Logement Etudiant</Typography>}

<IconButton onClick={toggleDrawer} sx={{color:"#fff"}}>
{open?<ChevronLeftIcon/>:<MenuIcon/>}
</IconButton>

</Box>

<Divider/>

<Box sx={{p:1}}>

<TextField
fullWidth
size="small"
type="number"
placeholder="Population Etudiante"
value={filterText}
onChange={(e)=>{
setFilterText(e.target.value);
setMaxTotal(e.target.value);
}}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<FilterAltIcon sx={{color:"#cbd5e1"}}/>
</InputAdornment>
)
}}
sx={{background:"#334155",borderRadius:1,input:{color:"#fff"}}}
/>

</Box>

<List sx={{flex:1,overflowY:"auto"}}>

{menuItems.map((item,i)=>(

<Box key={i}>

<ListItem disablePadding>

<ListItemButton onClick={()=>handleToggleMenu(item.text)}>

<ListItemIcon sx={{color:"#cbd5e1"}}>
{item.icon}
</ListItemIcon>

{open&&<ListItemText primary={item.text}/>}

{open&&(openMenus[item.text]?<ExpandLess/>:<ExpandMore/>)}

</ListItemButton>

</ListItem>

<Collapse in={openMenus[item.text]}>

<List component="div" disablePadding>

{item.types && item.types.map((sub,j)=>{

const value=sub.value||sub;
const label=sub.label||sub;
const key=`${item.text}-${value}`;

return(

<ListItem key={j} disablePadding>

<ListItemButton sx={{pl:6}} onClick={()=>handleCheck(item.text,value)}>

<Checkbox checked={checkedItems[key]||false} sx={{color:"#cbd5e1"}}/>

<ListItemText primary={label}/>

</ListItemButton>

</ListItem>

);

})}

{item.slider && (
<Box sx={{px:3,py:2}}>
<Slider
value={prixRange}
onChange={(e,newValue)=>setPrixRange(newValue)}
valueLabelDisplay="auto"
min={0}
max={100000}
step={10000}
sx={{color:"#38bdf8"}}
/>
</Box>
)}

{item.sliderEau && (
<Box sx={{px:3,py:2}}>
<Slider
value={eauRange}
onChange={(e,newValue)=>setEauRange(newValue)}
valueLabelDisplay="auto"
min={0}
max={20000}
step={1000}
sx={{color:"#22c55e"}}
/>
</Box>
)}

</List>

</Collapse>

</Box>

))}
</List>

<Box
onClick={handleUserMenu}
sx={{
width:"100%",
display:"flex",
alignItems:"center",
gap:1,
p:2,
borderTop:"1px solid #334155",
cursor:"pointer",
"&:hover":{background:"#334155"}
}}
>

<Avatar>{user.initials}</Avatar>

{open && <Typography>{user.name}</Typography>}

</Box>

<Menu
anchorEl={anchorEl}
open={Boolean(anchorEl)}
onClose={handleCloseUserMenu}
>

<MenuItem onClick={adminLogin}>
<AdminPanelSettingsIcon sx={{mr:1}}/>
Admin
</MenuItem>

<MenuItem onClick={logout}>
<LogoutIcon sx={{mr:1}}/>
Logout
</MenuItem>

</Menu>

</Drawer>

</Box>

);

}