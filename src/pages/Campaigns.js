import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { campaignApi } from "../utils/api";
import { CampaignStatus, defaultCampaign } from "../types";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState(defaultCampaign);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignApi.getAll();
      setCampaigns(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch campaigns: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        ...campaign,
        startDate: campaign.startDate ? campaign.startDate.split("T")[0] : "",
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        ...defaultCampaign,
        startDate: new Date().toISOString().split("T")[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCampaign(null);
    setFormData(defaultCampaign);
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate),
      };

      if (editingCampaign) {
        await campaignApi.update(editingCampaign._id, submitData);
      } else {
        await campaignApi.create(submitData);
      }
      await fetchCampaigns();
      handleCloseDialog();
      setError("");
    } catch (err) {
      setError(
        `Failed to ${editingCampaign ? "update" : "create"} campaign: ` +
          err.message
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await campaignApi.delete(id);
        await fetchCampaigns();
        setError("");
      } catch (err) {
        setError("Failed to delete campaign: " + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading campaigns...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">
          <CampaignIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Campaign
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Title Concept</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        No campaigns found. Create your first campaign to get
                        started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {campaign.name}
                        </Typography>
                        {campaign.description && (
                          <Typography variant="caption" color="text.secondary">
                            {campaign.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.status}
                          size="small"
                          color={getStatusColor(campaign.status)}
                        />
                      </TableCell>
                      <TableCell>{formatDate(campaign.startDate)}</TableCell>
                      <TableCell>{campaign.titleConcept}</TableCell>
                      <TableCell>
                        {campaign.tags && campaign.tags.length > 0
                          ? campaign.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ mr: 0.5 }}
                              />
                            ))
                          : "None"}
                      </TableCell>
                      <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(campaign)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(campaign._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Campaign Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Campaign Name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Title Concept"
              value={formData.titleConcept}
              onChange={handleInputChange("titleConcept")}
              required
              fullWidth
            />
            <TextField
              label="Message Concept"
              value={formData.messageConcept}
              onChange={handleInputChange("messageConcept")}
              required
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleInputChange("status")}
              >
                {Object.entries(CampaignStatus).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange("startDate")}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Tags (comma separated)"
              value={formData.tags ? formData.tags.join(", ") : ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                }))
              }
              fullWidth
              helperText="Enter tags separated by commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCampaign ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Campaigns;
