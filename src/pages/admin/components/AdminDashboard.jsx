import React, { useState, useEffect } from "react";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Grid, Paper
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TableViewIcon from '@mui/icons-material/TableView';
import { useNavigate } from "react-router-dom";

// 🔹 Chart
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const drawerWidth = 240;

// 🔹 CARD
const StatCard = ({ title, value }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: 3,
      textAlign: "center",
      width: "100%"   // 🔥 IMPORTANT
    }}
  >
    <Typography sx={{ fontWeight: "bold", color: "#000" }}>
      {title}
    </Typography>

    <Typography
      variant="h4"
      sx={{ fontWeight: "bold", color: "#1976d2", mt: 1 }}
    >
      {value}
    </Typography>
  </Paper>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    totalEtudiants: 0,
    dominant: "",
    nbFokontany: 0
  });

  const [fokontanyData, setFokontanyData] = useState([]);

  // 🔥 FETCH STATISTICS
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/table/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH TOTAL ETUDIANTS PAR FOKONTANY
  const fetchFokontanyData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/table");
      const geojson = await res.json();
      // transformer en format pour histogramme
      const chartData = geojson.features.map(item => ({
        fokontany: item.properties.fokontany,
        total: item.properties.total
      }));
      setFokontanyData(chartData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFokontanyData();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8" }}>
      
      {/* 🔹 SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#1e293b",
            color: "#fff"
          }
        }}
      >
        <List>
          <ListItemButton onClick={() => navigate("")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

           <ListItemButton onClick={() => navigate("/registeradmin")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Gestion Admin" />
          </ListItemButton>
          
          <ListItemButton onClick={() => navigate("/table")}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <TableViewIcon />
            </ListItemIcon>
            <ListItemText primary="Gestion des Données" />
          </ListItemButton>

         

        </List>
      </Drawer>

      {/* 🔹 MAIN */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto"
        }}
      >
        {/* CARDS */}
        <Grid container spacing={10} justifyContent="center" maxWidth="100%" mb={7}>
          <Grid item>
            <StatCard title="Utilisateurs" value={stats.users} />
          </Grid>

          <Grid item>
            <StatCard title="Total Étudiants" value={stats.totalEtudiants} />
          </Grid>

          <Grid item>
            <StatCard title="Fokontany Dominant" value={stats.dominant} />
          </Grid>

          <Grid item>
            <StatCard title="Fokontany Résidés" value={stats.nbFokontany} />
          </Grid>
        </Grid>

        {/* HISTOGRAMME TOTAL ETUDIANTS PAR FOKONTANY */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total Étudiants par Fokontany
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={fokontanyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fokontany" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#1976d2" name="Total Étudiants" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;