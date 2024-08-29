import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import LuggageIcon from '@mui/icons-material/Luggage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GroupIcon from '@mui/icons-material/Group';


function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <Avatar
          className='self-center mt-8'
          alt="Username"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <div className='flex-row self-center my-4'>
          <p className='mx-4'>Hello</p>
          <p>Username</p>
        </div>
        <Divider />
        <List>
          {['Dashboard', 'Transaction', 'Transfer', 'Trips', 'Notification'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate(`/${text}`)}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {
                    text === 'Dashboard' ? (
                      <HomeIcon />
                    ) : text === 'Notification' ? (
                      <MailIcon />
                    ) : text === 'Trips' ? (
                      <LuggageIcon />
                    ) : text === 'Transfer' ? (
                      <CurrencyExchangeIcon />
                    ) : (
                      <AccountBalanceIcon />
                    )
                  }
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Friends'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={()=>{navigate(`/${text}`)}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {
                    text === 'Credit Card' ? (
                      <CreditCardIcon />
                    ) :  (
                      <GroupIcon />
                    )
                  }
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
    </Box>
  );
}
