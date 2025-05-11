'use client';

import { Box, Typography, List, ListItem, IconButton } from '@mui/material';
import { Key as KeyIcon, Add as AddIcon } from '@mui/icons-material';

interface BoardItem {
  icon: React.ReactNode;
  category: string;
  title: string;
  date: string;
  author: string;
}

interface BoardListProps {
  title: string;
  items: BoardItem[];
  onAddClick?: () => void;
}

const BoardList = ({ title, items, onAddClick }: BoardListProps) => {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#fff',
        borderRadius: 1,
        boxShadow: 1,
        marginBottom: 3,        
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,          
          width: 500,
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <IconButton onClick={onAddClick} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      < List >
        {items.map((item, index) => (
          <ListItem
            key={index}
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 1.5,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                '& > *:not(:last-child)': {
                  marginRight: 1,
                },
              }}
            >
              <KeyIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                {item.category} |
              </Typography>
              <Typography variant="body1">
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginLeft: 'auto',
                  color: '#666',
                }}
              >
                {item.date} {item.author}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BoardList; 