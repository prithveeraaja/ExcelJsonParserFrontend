import React, { useState } from 'react';
import { Tabs, Tab, Box, Container, Typography, Paper } from '@mui/material';
import ExcelToJson from './components/ExcelToJson';
import JsonToExcel from './components/JsonToExcel';
import './App.css';

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" className="app-container">
      <Paper elevation={3} className="main-paper">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Excel ⟷ JSON Parser
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Convert Excel files to JSON with automatic schema detection or convert JSON back to Excel format.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Excel to JSON" />
            <Tab label="JSON to Excel" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ExcelToJson />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <JsonToExcel />
        </TabPanel>
      </Paper>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default App;
