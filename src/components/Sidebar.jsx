import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
  ListItemButton,
  Collapse,
  Checkbox,
  TextField
} from "@mui/material";

import SecurityIcon from '@mui/icons-material/Security';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaidIcon from '@mui/icons-material/Paid';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function Sidebar({
  maxTotal,
  setMaxTotal,
  selectedTypes,
  setSelectedTypes
}) {

  const [open, setOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [filterText, setFilterText] = useState("");

  const toggleDrawer = () => setOpen(!open);

  const handleToggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Synchronisation maxTotal <-> input
  useEffect(() => {
    if (maxTotal !== undefined) {
      setFilterText(maxTotal);
    }
  }, [maxTotal]);

  const handleCheck = (menu, sub) => {
    const key = `${menu}-${sub}`;

    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // 🔥 TYPE DE LOGEMENT → CAMEMBERT
    if (menu === "Type de logement") {
      const value = sub.toLowerCase();

      setSelectedTypes(prev =>
        prev.includes(value)
          ? prev.filter(t => t !== value)
          : [...prev, value]
      );
    }
  };

  const menuItems = [
    {
      text: "Type de logement",
      icon: <ApartmentIcon />,
      subMenus: ["Location", "Colocation", "Parents/Famille", "Cité"],
    },
    {
      text: "Coût Logement",
      icon: <MonetizationOnIcon />,
      subMenus: ["Afficher carte", "Mes localisations", "Mesure distance", "Imprimer"],
    },
    {
      text: "Sécurité",
      icon: <SecurityIcon />,
      subMenus: ["Routes", "Bâtiments", "Rivières", "Points d'intérêt"],
    },
    {
      text: "Eau",
      icon: <WaterDropIcon />,
      subMenus: ["Profil", "Préférences", "Sécurité", "Notifications"],
    },
    {
      text: "Electricité",
      icon: <ElectricBoltIcon />,
      subMenus: ["Profil", "Préférences", "Sécurité", "Notifications"],
    },
    {
      text: "Coût",
      icon: <PaidIcon />,
      subMenus: ["Profil", "Préférences", "Sécurité", "Notifications"],
    },
  ];

  const filterSubMenus = (subMenus) => {
    return subMenus.filter((sub) =>
      sub.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 70,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            color: "#fff",
            transition: "0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            alignItems: "center",
            p: 1,
          }}
        >
          {open && (
            <Typography variant="h6" fontWeight="bold">
              Logement_Etudiant
            </Typography>
          )}

          <IconButton onClick={toggleDrawer} sx={{ color: "#fff" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: "#334155" }} />

        {/* 🔥 FILTRE MAX TOTAL */}
        {open && (
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="number"
              variant="outlined"
              placeholder="Population Etudiante"
              value={filterText}
              onChange={(e) => {
                const value = e.target.value;
                setFilterText(value);
                setMaxTotal(value);
              }}
              sx={{
                backgroundColor: "#334155",
                borderRadius: 1,
                input: { color: "#fff" },
              }}
            />
          </Box>
        )}

        {/* MENU COMPLET (inchangé) */}
        <List>
          {menuItems.map((item, index) => {
            const filteredSubs = filterSubMenus(item.subMenus);

            return (
              <Box key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleToggleMenu(item.text)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#334155" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#cbd5e1" }}>
                      {item.icon}
                    </ListItemIcon>

                    {open && <ListItemText primary={item.text} />}

                    {open &&
                      (openMenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>

                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {filteredSubs.map((sub, i) => {
                      const key = `${item.text}-${sub}`;

                      return (
                        <ListItem key={i} disablePadding>
                          <ListItemButton
                            onClick={() => handleCheck(item.text, sub)}
                            sx={{
                              pl: 6,
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "#475569" },
                            }}
                          >
                            <Checkbox
                              checked={checkedItems[key] || false}
                              sx={{
                                color: "#cbd5e1",
                                "&.Mui-checked": { color: "#38bdf8" },
                              }}
                            />
                            <ListItemText primary={sub} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}