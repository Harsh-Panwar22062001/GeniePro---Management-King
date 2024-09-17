import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Slider,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  MdNotifications, 
  MdSecurity, 
  MdPerson, 
  MdLanguage, 
  MdColorLens, 
  MdAccessibility,
  MdCloud,
  MdPrivacyTip
} from 'react-icons/md';

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: 'auto',
  marginRight: theme.spacing(4),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const SettingsTab = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
  });
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);
  const [dataUsage, setDataUsage] = useState(50);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (event) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleDataUsageChange = (event, newValue) => {
    setDataUsage(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Settings
        </Typography>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
        >
          <StyledTab icon={<MdPerson />} label="Profile" />
          <StyledTab icon={<MdNotifications />} label="Notifications" />
          <StyledTab icon={<MdSecurity />} label="Security" />
          <StyledTab icon={<MdLanguage />} label="Language" />
          <StyledTab icon={<MdColorLens />} label="Appearance" />
          <StyledTab icon={<MdAccessibility />} label="Accessibility" />
          <StyledTab icon={<MdCloud />} label="Data" />
          <StyledTab icon={<MdPrivacyTip />} label="Privacy" />
        </Tabs>

        <SettingsTab value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Profile Settings</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Avatar sx={{ width: 100, height: 100, mb: 2 }}>JD</Avatar>
              <Button variant="outlined">Change Avatar</Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField label="Full Name" variant="outlined" fullWidth margin="normal" />
              <TextField label="Email" variant="outlined" fullWidth margin="normal" />
              <TextField label="Job Title" variant="outlined" fullWidth margin="normal" />
              <TextField label="Bio" variant="outlined" fullWidth multiline rows={4} margin="normal" />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Update Profile</Button>
            </Grid>
          </Grid>
        </SettingsTab>

        <SettingsTab value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Notification Settings</Typography>
          <Grid container spacing={2}>
            {Object.entries(notifications).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <FormControlLabel
                  control={<Switch checked={value} onChange={handleNotificationChange} name={key} />}
                  label={`${key.charAt(0).toUpperCase() + key.slice(1)} Notifications`}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Notification Frequency</Typography>
            <Select
              value={notifications.frequency || 'immediately'}
              onChange={(e) => setNotifications({...notifications, frequency: e.target.value})}
              fullWidth
            >
              <MenuItem value="immediately">Immediately</MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </Box>
        </SettingsTab>

        <SettingsTab value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Security Settings</Typography>
          <TextField type="password" label="Current Password" variant="outlined" fullWidth margin="normal" />
          <TextField type="password" label="New Password" variant="outlined" fullWidth margin="normal" />
          <TextField type="password" label="Confirm New Password" variant="outlined" fullWidth margin="normal" />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>Change Password</Button>
          <Divider sx={{ my: 4 }} />
          <Typography variant="subtitle1" gutterBottom>Two-Factor Authentication</Typography>
          <FormControlLabel
            control={<Switch />}
            label="Enable Two-Factor Authentication"
          />
        </SettingsTab>

        <SettingsTab value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Language Settings</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={language}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
              <MenuItem value="zh">中文</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>Save Language Preference</Button>
        </SettingsTab>

        <SettingsTab value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Appearance Settings</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="theme-select-label">Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              id="theme-select"
              value={theme}
              label="Theme"
              onChange={handleThemeChange}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 4 }}>
            <Typography id="font-size-slider" gutterBottom>
              Font Size
            </Typography>
            <Slider
              value={fontSize}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={12}
              max={24}
            />
          </Box>
        </SettingsTab>

        <SettingsTab value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>Accessibility Settings</Typography>
          <FormControlLabel
            control={<Switch />}
            label="High Contrast Mode"
          />
          <FormControlLabel
            control={<Switch />}
            label="Screen Reader Optimized"
          />
          <FormControlLabel
            control={<Switch />}
            label="Reduce Motion"
          />
        </SettingsTab>

        <SettingsTab value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>Data Usage Settings</Typography>
          <Typography id="data-usage-slider" gutterBottom>
            Data Saver Mode (Limit data usage to {dataUsage}%)
          </Typography>
          <Slider
            value={dataUsage}
            onChange={handleDataUsageChange}
            aria-labelledby="data-usage-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={100}
          />
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>Clear Cache</Button>
        </SettingsTab>

        <SettingsTab value={tabValue} index={7}>
          <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
          <FormControlLabel
            control={<Switch />}
            label="Allow Usage Data Collection"
          />
          <FormControlLabel
            control={<Switch />}
            label="Show Online Status"
          />
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Connected Accounts</Typography>
            <Grid container spacing={2}>
              {['Google', 'Facebook', 'Twitter', 'LinkedIn'].map((account) => (
                <Grid item key={account}>
                  <Chip label={account} onDelete={() => {}} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </SettingsTab>
      </Paper>
    </Box>
  );
};

export default Settings;