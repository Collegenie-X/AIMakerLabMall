import { Box, Typography, Grid } from '@mui/material';

interface MenuSection {
  title: string;
  items: {
    name: string;
    link: string;
  }[];
}

interface MegaMenuProps {
  sections: MenuSection[];
}

export default function MegaMenu({ sections }: MegaMenuProps) {
  return (
    <Box className="bg-white shadow-lg p-6">
      <Grid container spacing={4}>
        {sections.map((section, index) => (
           <Grid sm={6} lg={3} key={index}>
            <Typography variant="h6" className="mb-4 font-bold">
              {section.title}
            </Typography>
            <Box component="ul" className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <Box component="li" key={itemIndex}>
                  <a
                    href={item.link}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </a>
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 