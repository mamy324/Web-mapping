
import AdminDashboard from "./components/AdminDashboard";
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

import AdminLayout from "./components/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function Logement() {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    fokontany: "",
    total: "",
    homme: "",
    femme: "",
    licence1: "",
    licence2: "",
    licence3: "",
    master1: "",
    master2: "",
  });

  // 🔹 FETCH
  const fetchData = async () => {
    const res = await fetch("http://localhost:8000/api/table");
    const geojson = await res.json();
    setData(geojson.features);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 SELECT
  const handleSelect = (item) => {
    setSelected(item);

    setForm({
      fokontany: item.properties.fokontany,
      total: item.properties.total,
      homme: item.properties.homme,
      femme: item.properties.femme,
      licence1: item.properties.licence1,
      licence2: item.properties.licence2,
      licence3: item.properties.licence3,
      master1: item.properties.master1,
      master2: item.properties.master2,
    });
  };

  // 🔹 CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 UPDATE
  const handleUpdate = async () => {
    if (!selected) return alert("Sélectionnez une ligne");

    await fetch(`http://localhost:8000/api/table/${selected.properties.gid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    fetchData();
  };

  // 🔹 RESET
  const handleReset = () => {
    setSelected(null);
    setForm({
      fokontany: "",
      total: "",
      homme: "",
      femme: "",
      licence1: "",
      licence2: "",
      licence3: "",
      master1: "",
      master2: "",
    });
  };

  //  DELETE ALL sécurisé
  const handleDeleteAll = async () => {
    if (confirmText !== "CONFIRMER") {
      return alert("Tapez CONFIRMER !");
    }

    await fetch("http://localhost:8000/api/table/all", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: confirmText }),
    });

    setConfirmText("");
    fetchData();
  };

  // 📥 IMPORT GEOJSON
  const handleImport = async () => {
  if (!file) return alert("Choisir un fichier");

  const formData = new FormData();
  formData.append("file", file);

  await fetch("http://localhost:8000/api/table/import", {
    method: "POST",
    body: formData,
  });

  setFile(null);
  fetchData(); // 🔥 recharge carte automatiquement
};

  // 📤 EXPORT CSV
  const handleExport = () => {
    window.open("http://localhost:8000/api/table/export");
  };

  return (
    <AdminLayout>
      <Box sx={{ flexGrow: 1, p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Gestion des données logement
      </Typography>

      {/* 🔹 ACTIONS GLOBALES ALIGNÉES */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Actions globales
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Export à gauche */}
          <Button variant="contained" color="success" onClick={handleExport}>
            Export CSV
          </Button>

          {/* Import au centre */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button variant="contained" sx={{ backgroundColor: "gray", color: "#fff" }} onClick={handleImport}>
              Import GeoJSON
            </Button>
          </Box>

    
          
        </Box>
      </Paper>

      {/* 🔹 FORMULAIRE DE MODIFICATION */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Modifier une ligne
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField name="fokontany" label="Fokontany" value={form.fokontany} onChange={handleChange} />
          <TextField name="total" label="Total" value={form.total} onChange={handleChange} />
          <TextField name="homme" label="Homme" value={form.homme} onChange={handleChange} />
          <TextField name="femme" label="Femme" value={form.femme} onChange={handleChange} />

          <TextField name="licence1" label="L1" value={form.licence1} onChange={handleChange} />
          <TextField name="licence2" label="L2" value={form.licence2} onChange={handleChange} />
          <TextField name="licence3" label="L3" value={form.licence3} onChange={handleChange} />

          <TextField name="master1" label="M1" value={form.master1} onChange={handleChange} />
          <TextField name="master2" label="M2" value={form.master2} onChange={handleChange} />

          <Button onClick={handleUpdate} variant="contained">
            Modifier
          </Button>

          <Button onClick={handleReset} variant="outlined">
            Actualiser
          </Button>
          <Button
              variant="outlined" color="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Visualiser
            </Button>
        </Box>
      </Paper>

      {/* 🔹 TABLEAU DES DONNÉES */}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fokontany</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Homme</TableCell>
              <TableCell>Femme</TableCell>
              <TableCell>L1</TableCell>
              <TableCell>L2</TableCell>
              <TableCell>L3</TableCell>
              <TableCell>M1</TableCell>
              <TableCell>M2</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.properties.gid}>
                <TableCell>{item.properties.fokontany}</TableCell>
                <TableCell>{item.properties.total}</TableCell>
                <TableCell>{item.properties.homme}</TableCell>
                <TableCell>{item.properties.femme}</TableCell>
                <TableCell>{item.properties.licence1}</TableCell>
                <TableCell>{item.properties.licence2}</TableCell>
                <TableCell>{item.properties.licence3}</TableCell>
                <TableCell>{item.properties.master1}</TableCell>
                <TableCell>{item.properties.master2}</TableCell>
                <TableCell>
                  <Button onClick={() => handleSelect(item)}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
       </Box>
    </AdminLayout>
  );
}
