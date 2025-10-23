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
  Autocomplete,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { contactApi, companyApi } from "../utils/api";
import { ContactStatus, defaultContact } from "../types";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState(defaultContact);

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getAll();
      setContacts(response.data);
      setError("");
    } catch (err) {
      setError(
        "Failed to fetch contacts: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyApi.getAll();
      setCompanies(response.data);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        ...contact,
        lastContacted: contact.lastContacted
          ? contact.lastContacted.split("T")[0]
          : "",
        created: contact.created ? contact.created.split("T")[0] : "",
      });
    } else {
      setEditingContact(null);
      setFormData({
        ...defaultContact,
        created: new Date().toISOString().split("T")[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
    setFormData(defaultContact);
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Require companyCode for all contacts
      if (!formData.companyCode) {
        setError("Please select a company for this contact.");
        return;
      }

      const submitData = {
        ...formData,
        lastContacted: formData.lastContacted
          ? new Date(formData.lastContacted)
          : null,
        created: formData.created ? new Date(formData.created) : new Date(),
      };

      if (editingContact) {
        await contactApi.update(editingContact._id, submitData);
      } else {
        await contactApi.create(submitData);
      }
      await fetchContacts();
      handleCloseDialog();
      setError("");
    } catch (err) {
      setError(
        `Failed to ${editingContact ? "update" : "create"} contact: ` +
          err.message
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactApi.delete(id);
        await fetchContacts();
        setError("");
      } catch (err) {
        setError("Failed to delete contact: " + err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "customer":
        return "success";
      case "prospect":
        return "warning";
      case "lead":
        return "info";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const getCompanyName = (companyCode) => {
    const company = companies.find((c) => c.companyCode === companyCode);
    return company ? company.name : companyCode || "N/A";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading contacts...</Typography>
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
          <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Contacts
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Contact
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Last Contacted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary">
                        No contacts found. Add your first contact to get
                        started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        {contact.role && (
                          <Typography variant="caption" color="text.secondary">
                            {contact.role}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        {getCompanyName(contact.companyCode)}
                      </TableCell>
                      <TableCell>{contact.position || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.status}
                          size="small"
                          color={getStatusColor(contact.status)}
                        />
                      </TableCell>
                      <TableCell>{contact.phone || "N/A"}</TableCell>
                      <TableCell>{formatDate(contact.lastContacted)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(contact)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(contact._id)}
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

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingContact ? "Edit Contact" : "Add New Contact"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                required
                fullWidth
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              fullWidth
            />
            <Autocomplete
              options={companies}
              getOptionLabel={(option) =>
                `${option.name} (${option.companyCode})`
              }
              value={
                companies.find((c) => c.companyCode === formData.companyCode) ||
                null
              }
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  companyCode: newValue ? newValue.companyCode : "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company"
                  required
                  fullWidth
                  error={
                    !formData.companyCode && error.includes("select a company")
                  }
                  helperText={
                    !formData.companyCode && error.includes("select a company")
                      ? "Please select a company"
                      : "Select from existing companies or type a new company code"
                  }
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <strong>{option.name}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      Code: {option.companyCode} | Industry:{" "}
                      {option.industry || "N/A"}
                    </small>
                  </div>
                </li>
              )}
              noOptionsText="No companies found. You may need to add a company first."
              freeSolo
              onInputChange={(event, newInputValue) => {
                if (event && event.type === "change") {
                  setFormData((prev) => ({
                    ...prev,
                    companyCode: newInputValue,
                  }));
                }
              }}
            />
            companyCode: newInputValue, })); } }} />
            <TextField
              label="Position"
              value={formData.position}
              onChange={handleInputChange("position")}
              fullWidth
            />
            <TextField
              label="Role"
              value={formData.role}
              onChange={handleInputChange("role")}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleInputChange("status")}
              >
                {Object.entries(ContactStatus).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Source"
              value={formData.source}
              onChange={handleInputChange("source")}
              fullWidth
            />
            <TextField
              label="Last Contacted"
              type="date"
              value={formData.lastContacted}
              onChange={handleInputChange("lastContacted")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleInputChange("notes")}
              fullWidth
              multiline
              rows={3}
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
            {editingContact ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contacts;
