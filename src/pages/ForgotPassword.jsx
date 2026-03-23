import { useState } from "react";
import axios from "axios";

export default function ForgotPassword(){

const [email,setEmail] = useState("");

const handleSubmit = async(e)=>{
e.preventDefault();

try{
const res = await axios.post(
"http://localhost:8000/api/forgotpassword",
{ email }
);

console.log("SUCCESS :", res.data); // ✅ DEBUG
alert("Email envoyé !");
}catch(err){
console.log("ERREUR :", err.response?.data || err.message); // 🔥 IMPORTANT
alert("Erreur");
}
};

return(
<form onSubmit={handleSubmit}>
<input 
type="email" 
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<button type="submit">Envoyer</button>
</form>
);
}
