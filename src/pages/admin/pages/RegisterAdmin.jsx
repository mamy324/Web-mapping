/*import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Paper
} from "@mui/material";
import AdminLayout from "../components/AdminLayout";  

export default function AdminPanel() {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [admins,setAdmins]=useState([]);
  const [msg,setMsg]=useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const loadAdmins=async()=>{
    const res = await axios.get("http://localhost:8000/admin/all");
    setAdmins(res.data);
  };

  useEffect(()=>{
    loadAdmins();
  },[]);

  const addAdmin=async()=>{

    if(!passwordRegex.test(password)){
      setMsg("❌ Mot de passe invalide (majuscule + chiffre + 8 caractères)");
      return;
    }

    const res = await axios.post("http://localhost:8000/admin/add",{
      name,email,password
    });

    setMsg(res.data.message);
    loadAdmins();
  };

  const deleteAdmin=async(id)=>{
    await axios.delete(`http://localhost:8000/admin/delete/${id}`);
    loadAdmins();
  };

  return (
    <AdminLayout>
    
      <Box sx={{ flexGrow: 1, p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>

        <Typography variant="h4" fontWeight="bold" mb={3}>
          Gestion des Admins
        </Typography>

       
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Ajouter Admin
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField label="Nom" onChange={e=>setName(e.target.value)} />
            <TextField label="Email" onChange={e=>setEmail(e.target.value)} />
            <TextField label="Password" type="password" onChange={e=>setPassword(e.target.value)} />

            <Button variant="contained" onClick={addAdmin}>
              Ajouter
            </Button>
          </Box>

          <Typography mt={2} color="error">
            {msg}
          </Typography>
        </Paper>

      
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Liste des Admins
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {admins.map(a=>(
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={()=>deleteAdmin(a.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Paper>

      </Box>
     </AdminLayout>
  );
}*/

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Snackbar, Alert
} from "@mui/material";
import AdminLayout from "../components/AdminLayout";

export default function AdminPanel() {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [admins,setAdmins]=useState([]);

  const [msg,setMsg]=useState("");
  const [open,setOpen]=useState(false);
  const [type,setType]=useState("success");

  // 🔵 mode modification
  const [editId,setEditId]=useState(null);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const loadAdmins=async()=>{
    const res = await axios.get("http://localhost:8000/admin/all");
    setAdmins(res.data);
  };

  useEffect(()=>{
    loadAdmins();
  },[]);

  // ✅ AJOUT OU MODIFICATION
  const addAdmin=async()=>{

    if(!passwordRegex.test(password)){
      setMsg("❌ Mot de passe invalide (majuscule + chiffre + 8 caractères)");
      setType("error");
      setOpen(true);
      return;
    }

    try {

      let res;

      if(editId){  
        // 🔵 MODIFICATION
        res = await axios.put(`http://localhost:8000/admin/update-password/${editId}`,{
          password
        });

      } else {
        // 🟢 AJOUT
        res = await axios.post("http://localhost:8000/admin/add",{
          name,email,password
        });
      }

      setMsg(res.data.message);
      setType(res.data.success ? "success" : "error");
      setOpen(true);

      // reset form
      setName("");
      setEmail("");
      setPassword("");
      setEditId(null);

      loadAdmins();

    } catch {
      setMsg("Erreur serveur ❌");
      setType("error");
      setOpen(true);
    }
  };

  // 🔴 SUPPRESSION AVEC CONFIRMATION
  const deleteAdmin=async(id)=>{

    const confirm = window.confirm("Voulez-vous vraiment supprimer cet admin ?");
    if(!confirm) return;

    try {
      const res = await axios.delete(`http://localhost:8000/admin/delete/${id}`);

      setMsg(res.data.message);
      setType("success");
      setOpen(true);

      loadAdmins();

    } catch {
      setMsg("Erreur suppression ❌");
      setType("error");
      setOpen(true);
    }
  };

  // 🔵 CHARGER DONNÉES POUR MODIFIER
  const handleEdit=(admin)=>{
    setName(admin.name);
    setEmail(admin.email);
    setEditId(admin.id);
  };

  return (
    <AdminLayout>

      <Box sx={{ flexGrow: 1, p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>

        <Typography variant="h4" fontWeight="bold" mb={3}>
          Gestion des Admins
        </Typography>

        {/* FORM */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            {editId ? "Modifier Admin" : "Ajouter Admin"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Nom"
              value={name}
              onChange={e=>setName(e.target.value)}
            />

            <TextField
              label="Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              disabled={editId} // 🔒 email bloqué en modification
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />

            <Button variant="contained" onClick={addAdmin}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Box>
        </Paper>

        {/* TABLE */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Liste des Admins
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {admins.map(a=>(
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    
                    <Button
                      color="error"
                      variant="contained"
                      onClick={()=>deleteAdmin(a.id)}
                    >
                      Supprimer
                    </Button>

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={()=>handleEdit(a)}
                    >
                      Modifier
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Paper>

      </Box>

      {/* 🔥 MESSAGE AUTO DISPARAIT */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={()=>setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={type}>{msg}</Alert>
      </Snackbar>

    </AdminLayout>
  );
}
