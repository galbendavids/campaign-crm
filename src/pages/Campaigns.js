import React from 'react';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Campaigns = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Campaigns
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Campaign
        </Button>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Campaign Management
          </Typography>
          <Typography color="text.secondary">
            Your campaign list and management tools will be displayed here. 
            Features will include creating, editing, and tracking campaign performance.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Campaigns;