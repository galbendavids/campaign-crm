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
  Business as BusinessIcon,
} from "@mui/icons-material";
import { companyApi } from "../utils/api";
import { CompanySize, defaultCompany } from "../types";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState(defaultCompany);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getAll();
      setCompanies(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch companies: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({ ...company });
    } else {
      setEditingCompany(null);
      setFormData({ ...defaultCompany });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setFormData(defaultCompany);
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingCompany) {
        await companyApi.update(editingCompany._id, formData);
      } else {
        await companyApi.create(formData);
      }
      await fetchCompanies();
      handleCloseDialog();
      setError("");
    } catch (err) {
      setError(
        `Failed to ${editingCompany ? "update" : "create"} company: ` +
          err.message
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyApi.delete(id);
        await fetchCompanies();
        setError("");
      } catch (err) {
        setError("Failed to delete company: " + err.message);
      }
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
        <Typography>Loading companies...</Typography>
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
          <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Company
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
                  <TableCell>Company Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Industry</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary">
                        No companies found. Add your first company to get
                        started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {company.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={company.companyCode}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{company.industry || "N/A"}</TableCell>
                      <TableCell>{company.size || "N/A"}</TableCell>
                      <TableCell>{company.country || "N/A"}</TableCell>
                      <TableCell>
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {company.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(company.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(company)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(company._id)}
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

      {/* Add/Edit Company Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCompany ? "Edit Company" : "Add New Company"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Company Name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              fullWidth
            />
            <TextField
              label="Company Code"
              value={formData.companyCode}
              onChange={handleInputChange("companyCode")}
              required
              fullWidth
              helperText="Unique identifier for the company"
            />
            <FormControl fullWidth>
              <InputLabel>Company Size</InputLabel>
              <Select
                value={formData.size}
                label="Company Size"
                onChange={handleInputChange("size")}
              >
                {Object.entries(CompanySize).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Industry"
              value={formData.industry}
              onChange={handleInputChange("industry")}
              fullWidth
            />
            <TextField
              label="Website"
              value={formData.website}
              onChange={handleInputChange("website")}
              fullWidth
              placeholder="https://example.com"
            />
            <TextField
              label="Country"
              value={formData.country}
              onChange={handleInputChange("country")}
              fullWidth
            />
            <TextField
              label="Zone/Region"
              value={formData.zone}
              onChange={handleInputChange("zone")}
              fullWidth
            />
            <TextField
              label="Description/Purpose (AI)"
              value={formData.descriptionPurposeAI}
              onChange={handleInputChange("descriptionPurposeAI")}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Next Year's Targets (AI)"
              value={formData.nextYearsTargetsAI}
              onChange={handleInputChange("nextYearsTargetsAI")}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCompany ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Companies;
