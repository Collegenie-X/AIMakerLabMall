import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

interface ProductDescriptionProps {
  description: {
    features: string[];
    specifications: {
      manufacturer: string;
      components: string[];
      size: string;
      weight: string;
    };
  };
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      {/* 상품 특징 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          상품 특징
        </Typography>
        <List>
          {description.features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 상품 스펙 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          상품 스펙
        </Typography>
        <Box sx={{ '& > div': { py: 2 } }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              제조사
            </Typography>
            <Typography>{description.specifications.manufacturer}</Typography>
          </Box>
          
          <Divider />

          <Box>
            <Typography color="text.secondary" gutterBottom>
              구성품
            </Typography>
            <List dense>
              {description.specifications.components.map((component, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={component} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          <Box>
            <Typography color="text.secondary" gutterBottom>
              제품 크기
            </Typography>
            <Typography>{description.specifications.size}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography color="text.secondary" gutterBottom>
              제품 무게
            </Typography>
            <Typography>{description.specifications.weight}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 