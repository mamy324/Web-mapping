import React from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TableViewIcon from '@mui/icons-material/TableView';
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>

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
          <ListItemButton onClick={() => navigate("/admin/dashboard")}>
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

      {/* 🔹 CONTENU DES PAGES */}
      <Box sx={{ flexGrow: 1, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        {children}
      </Box>

    </Box>
  );
}