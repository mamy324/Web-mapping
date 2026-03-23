
import React,{useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

import {
Box,
Card,
CardContent,
TextField,
Typography,
Button
} from "@mui/material";

function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleRegister = async(e)=>{

e.preventDefault();

await axios.post(
"http://localhost:8000/api/register",
{name,email,password}
);

navigate("/");

};

return(

<Box
sx={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
backgroundColor:"#0f172a"
}}
>

<Card
sx={{
width:380,
backgroundColor:"#1e293b",
borderRadius:3,
boxShadow:"0 10px 40px rgba(0,0,0,0.6)"
}}
>

<CardContent>

<Typography
variant="h5"
fontWeight="bold"
color="#e2e8f0"
mb={1}
>
Créer un compte
</Typography>

<Typography
variant="body2"
color="#94a3b8"
mb={3}
>
Inscrivez-vous pour accéder à votre espace.
</Typography>

<form onSubmit={handleRegister}>

<TextField
label="Nom"
fullWidth
margin="normal"
onChange={(e)=>setName(e.target.value)}
InputLabelProps={{style:{color:"#94a3b8"}}}
InputProps={{
style:{color:"#e2e8f0"},
sx:{
"& fieldset":{
borderColor:"#334155"
}
}
}}
/>

<TextField
label="Adresse Email"
fullWidth
margin="normal"
onChange={(e)=>setEmail(e.target.value)}
InputLabelProps={{style:{color:"#94a3b8"}}}
InputProps={{
style:{color:"#e2e8f0"},
sx:{
"& fieldset":{
borderColor:"#334155"
}
}
}}
/>

<TextField
type="password"
label="Mot de passe"
fullWidth
margin="normal"
onChange={(e)=>setPassword(e.target.value)}
InputLabelProps={{style:{color:"#94a3b8"}}}
InputProps={{
style:{color:"#e2e8f0"},
sx:{
"& fieldset":{
borderColor:"#334155"
}
}
}}
/>

<Button
type="submit"
fullWidth
variant="contained"
sx={{
mt:3,
backgroundColor:"#0f766e",
"&:hover":{
backgroundColor:"#115e59"
}
}}
>
Créer un compte
</Button>

</form>

<Box textAlign="center" mt={3}>

<Typography variant="body2" color="#94a3b8">
Vous avez déjà un compte ?
<Link to="/" style={{color:"#22c55e"}}>
{" "}Se connecter
</Link>
</Typography>

</Box>

</CardContent>

</Card>

</Box>

);

}

export default Register;