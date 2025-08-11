import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Preview as PreviewIcon, List as ListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Create Forms',
      description: 'Build dynamic forms with customizable fields and validations',
      icon: <AddIcon className="text-4xl text-primary mb-3" />,
      action: () => navigate('/create'),
      buttonText: 'Start Building'
    },
    {
      title: 'Preview Forms',
      description: 'Test how your forms behave for end users',
      icon: <PreviewIcon className="text-4xl text-secondary mb-3" />,
      action: () => navigate('/preview'),
      buttonText: 'Preview Forms'
    },
    {
      title: 'My Forms',
      description: 'View and manage all your saved forms',
      icon: <ListIcon className="text-4xl text-success mb-3" />,
      action: () => navigate('/myforms'),
      buttonText: 'View Forms'
    }
  ];

  return (
    <Box className="form-builder-container min-h-screen">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-text-primary mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Dynamic Form Builder
          </Typography>
          <Typography variant="h5" className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Create powerful, customizable forms with advanced validation rules and derived fields
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            className="bg-gradient-primary px-8 py-3 text-lg"
          >
            Build Your First Form
          </Button>
        </Box>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full bg-surface hover:shadow-lg transition-all duration-300 text-center animate-fade-in">
              <CardContent className="p-6">
                <Box className="flex flex-col items-center">
                  {feature.icon}
                  <Typography variant="h5" className="font-semibold text-text-primary mb-3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="text-text-secondary mb-4">
                    {feature.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={feature.action}
                    className="mt-auto border-primary text-primary hover:bg-primary-light"
                  >
                    {feature.buttonText}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <Box className="mt-16 text-center">
          <Typography variant="h4" className="font-bold text-text-primary mb-8">
            Powerful Features
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Box className="p-4">
              <Typography variant="h6" className="font-semibold text-primary mb-2">
                7 Field Types
              </Typography>
              <Typography variant="body2" className="text-text-secondary">
                Text, Number, Textarea, Select, Radio, Checkbox, Date
              </Typography>
            </Box>
            <Box className="p-4">
              <Typography variant="h6" className="font-semibold text-secondary mb-2">
                Smart Validation
              </Typography>
              <Typography variant="body2" className="text-text-secondary">
                Built-in rules for email, password, length validation
              </Typography>
            </Box>
            <Box className="p-4">
              <Typography variant="h6" className="font-semibold text-success mb-2">
                Derived Fields
              </Typography>
              <Typography variant="body2" className="text-text-secondary">
                Auto-computed fields based on other field values
              </Typography>
            </Box>
            <Box className="p-4">
              <Typography variant="h6" className="font-semibold text-warning mb-2">
                Local Storage
              </Typography>
              <Typography variant="body2" className="text-text-secondary">
                All forms saved locally, no backend required
              </Typography>
            </Box>
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default Index;