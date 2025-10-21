import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";

const Reports = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analytics & Reports
          </Typography>
          <Typography color="text.secondary">
            Campaign analytics, performance metrics, and detailed reports will
            be displayed here. Features will include charts, graphs, and
            exportable reports.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
