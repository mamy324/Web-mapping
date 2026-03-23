import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword(){

const { token } = useParams();
const navigate = useNavigate();

const [password,setPassword] = useState("");

const handleSubmit = async(e)=>{
e.preventDefault();

try{
await axios.post(
`http://localhost:8000/api/resetpassword/${token}`,
{password}
);

alert("Mot de passe changé !");
navigate("/");
}catch{
alert("Erreur");
}
};

return(
<form onSubmit={handleSubmit}>
<input 
type="password"
placeholder="Nouveau mot de passe"
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">Changer</button>
</form>
);
}
