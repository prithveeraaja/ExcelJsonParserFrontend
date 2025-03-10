import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  TextField
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
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

function JsonToExcel() {
  const [file, setFile] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [formatInput, setFormatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.json')) {
        setError('Invalid file format. Only .json files are supported.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setJsonInput(''); // Clear text input when file is selected
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
    setFile(null); // Clear file when text input is used
  };

  const handleFormatInputChange = (event) => {
    setFormatInput(event.target.value);
  };

  const handleConvert = async () => {
    if (!file && !jsonInput) {
      setError('Please provide a JSON file or input JSON data');
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      let jsonData;
      
      if (file) {
        // Read JSON from file
        const text = await file.text();
        jsonData = JSON.parse(text);
      } else {
        // Parse JSON from input
        try {
          jsonData = JSON.parse(jsonInput);
        } catch (err) {
          throw new Error('Invalid JSON format. Please check your input.');
        }
      }
      
      // Parse format if provided
      let format = null;
      if (formatInput.trim()) {
        try {
          format = JSON.parse(formatInput);
        } catch (err) {
          throw new Error('Invalid format specification. Please check your input.');
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/api/json-to-excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: jsonData,
          format: format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert JSON to Excel');
      }

      // Create a download URL for the Excel file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file ? `${file.name.split('.')[0]}.xlsx` : 'converted.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
          minHeight: '150px'
        }}
      >
        <input
          accept=".json"
          id="json-file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="json-file-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Upload JSON File
          </Button>
        </label>
        
        {file && (
          <Typography variant="body2" color="textSecondary">
            Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Typography>
        )}
      </Paper>

      <Typography variant="body1" sx={{ mb: 1 }}>
        Or paste JSON data:
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder='{"Sheet1": [{"column1": "value1", "column2": "value2"}]}'
        value={jsonInput}
        onChange={handleJsonInputChange}
        variant="outlined"
        sx={{ mb: 3, fontFamily: 'monospace' }}
        disabled={!!file}
      />

      <Typography variant="body1" sx={{ mb: 1 }}>
        Excel Format (Optional):
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder='{"Sheet1": ["column1", "column2"]}'
        value={formatInput}
        onChange={handleFormatInputChange}
        variant="outlined"
        sx={{ mb: 3, fontFamily: 'monospace' }}
        helperText="Specify the Excel format as a JSON object with sheet names as keys and arrays of column names as values. Leave empty for automatic format detection."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConvert}
          disabled={(!file && !jsonInput) || loading}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Converting...
            </>
          ) : (
            'Convert to Excel'
          )}
        </Button>

        {downloadUrl && (
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownload}
          >
            Download Excel
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default JsonToExcel;
