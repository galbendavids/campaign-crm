import React from 'react';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Contacts = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Contacts
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}>
          Add Contact
        </Button>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contact Management
          </Typography>
          <Typography color="text.secondary">
            Your contact database will be displayed here. 
            Features will include adding, editing, and organizing customer contacts.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Contacts;