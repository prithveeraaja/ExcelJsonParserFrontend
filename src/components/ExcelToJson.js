import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  FormControlLabel, 
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import { CloudUpload, Download, Code } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { API_BASE_URL } from '../config';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const JsonDisplay = styled('pre')({
  backgroundColor: '#f5f5f5',
  padding: '16px',
  borderRadius: '4px',
  overflowX: 'auto',
  fontSize: '14px',
  fontFamily: 'monospace',
  maxHeight: '400px',
  overflowY: 'auto',
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`json-tabpanel-${index}`}
      aria-labelledby={`json-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ExcelToJson() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [schema, setSchema] = useState(null);
  const [showSchema, setShowSchema] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('Invalid file format. Only .xlsx and .xls files are supported.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setJsonData(null);
      setSchema(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/excel-to-json`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert Excel to JSON');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setJsonData(data.json);
      setSchema(data.schema);
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!jsonData) return;

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.split('.')[0]}.json` : 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '2px dashed rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
      >
        <input
          accept=".xlsx,.xls"
          id="excel-file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="excel-file-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Upload Excel File
          </Button>
        </label>
        
        {file && (
          <Typography variant="body2" color="textSecondary">
            Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Typography>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleConvert}
          disabled={!file || loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Converting...
            </>
          ) : (
            'Convert to JSON'
          )}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {jsonData && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Conversion Result</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download JSON
            </Button>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={showSchema}
                onChange={(e) => setShowSchema(e.target.checked)}
              />
            }
            label="Show detected schema"
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="JSON Output" />
              <Tab label="Schema" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <JsonDisplay>
              {JSON.stringify(jsonData, null, 2)}
            </JsonDisplay>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <JsonDisplay>
              {JSON.stringify(schema, null, 2)}
            </JsonDisplay>
          </TabPanel>
        </Box>
      )}
    </Box>
  );
}

export default ExcelToJson;
