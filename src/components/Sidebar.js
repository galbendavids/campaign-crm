import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/campaigns", label: "Campaigns", icon: CampaignIcon },
    { path: "/contacts", label: "Contacts", icon: PeopleIcon },
    { path: "/companies", label: "Companies", icon: BusinessIcon },
    { path: "/reports", label: "Reports", icon: AssessmentIcon },
  ];

  const drawerWidth = collapsed ? 80 : 280;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          transition: "width 0.3s ease",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          minHeight: 80,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <CampaignIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600} noWrap>
              Campaign CRM
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Box sx={{ p: 2, flex: 1 }}>
        {/* User Profile Section */}
        {!collapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              CU
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Campaign User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>
        )}

        <List sx={{ px: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    backgroundColor: isActive ? "#f0f4ff" : "transparent",
                    border: isActive
                      ? "1px solid #e0e7ff"
                      : "1px solid transparent",
                    color: isActive ? theme.palette.primary.main : "#6b7280",
                    "&:hover": {
                      backgroundColor: isActive ? "#e0e7ff" : "#f9fafb",
                      color: isActive ? theme.palette.primary.dark : "#374151",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: collapsed ? "auto" : 40,
                      justifyContent: "center",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.875rem",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {!collapsed && (
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              backgroundColor: "#f0f4ff",
              borderRadius: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Campaign CRM v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
