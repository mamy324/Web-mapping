

import React,{useState} from "react";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom";

import {
Box,
Card,
CardContent,
TextField,
Typography,
Button,
Divider
} from "@mui/material";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async(e)=>{

e.preventDefault();

try{

const res = await axios.post(
"http://localhost:8000/api/login",
{email,password}
);

localStorage.setItem("token",res.data.token);

navigate("/dashboard");

}catch(err){

alert("login failed");

}

};

return(

<Box
sx={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
backgroundColor:"#0f172a"   // background sombre
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
textAlign={"center"}
>
Se Connecter
</Typography>

<Typography
variant="body2"
color="#94a3b8"
mb={3}
textAlign={"center"}
>
Accédez à votre compte
</Typography>

<form onSubmit={handleLogin}>

<TextField
label="Adresse Email"
fullWidth
margin="normal"
variant="outlined"
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
variant="outlined"
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

<Box textAlign="right" mt={1}>
<Link to="/forgotpassword" style={{color:"#22c55e", textDecoration:"none"}}>
Mot de passe oublié ?
</Link>
</Box>

<Button
type="submit"
fullWidth
variant="contained"
sx={{
mt:2,
backgroundColor:"#0f766e",
"&:hover":{
backgroundColor:"#115e59"
}
}}
>
Se Connecter
</Button>

</form>

<Divider
sx={{
my:3,
borderColor:"#334155",
color:"#94a3b8"
}}
>
OU
</Divider>

<Button
fullWidth
variant="outlined"
href="http://localhost:8000/auth/google"
sx={{
borderColor:"#0f766e",
background: "#0f766e",
color:"#ffffff"
}}
>
Se connecter avec Google
</Button>

<Box textAlign="center" mt={2}>

<Typography variant="body2" color="#94a3b8">

Vous n'avez pas de compte ?

<Link to="/register" style={{color:"#22c55e"}}>
{" "}Créer un compte
</Link>

</Typography>

</Box>

</CardContent>

</Card>

</Box>

);

}

export default Login;