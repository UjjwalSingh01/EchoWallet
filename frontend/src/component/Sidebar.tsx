import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GroupIcon from '@mui/icons-material/Group';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/system';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import { Typography } from '@mui/material';
import { amber, grey } from '@mui/material/colors'; // Import amber and grey colors

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const drawerWidth = 260;

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
      backgroundColor: theme.palette.mode === 'dark' ? grey[900] : amber[400],
      borderRight: `1px solid ${theme.palette.divider}`,
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
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState("")

  useEffect(() => {
    const user: string = localStorage.getItem("user") || "username"
    setUser(user)

    if (isLargeScreen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLargeScreen]);

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        {isLargeScreen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
              backgroundColor: theme.palette.mode === 'dark' ? grey[800] : amber[300],
              color: theme.palette.getContrastText(theme.palette.mode === 'dark' ? grey[800] : amber[300]),
            }}
          >
            <Avatar
              alt="Username"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 64, height: 64, mb: 2, border: `2px solid ${theme.palette.background.paper}` }}
            />
            <Typography variant="h6" noWrap>
              Hello, {user}
            </Typography>
          </Box>
        )}

        <Divider />

        <List>
          {['Dashboard', 'Transaction', 'Transfer', 'Groups', 'Friends', 'Notification'].map((text) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => navigate(`/${text}`)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  transition: 'color 0.3s ease',
                  // Text color changes to white in light mode on hover/selected
                  '&:hover': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                  '&.Mui-selected': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {text === 'Dashboard' ? (
                    <HomeIcon />
                  ) : text === 'Notification' ? (
                    <MailIcon />
                  ) : text === 'Trips' ? (
                    <LuggageIcon />
                  ) : text === 'Transfer' ? (
                    <CurrencyExchangeIcon />
                  ) : text === 'Transaction' ? (
                    <AccountBalanceIcon />
                  ) : (
                    <GroupIcon />
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
          {['Profile', 'Help & Support' ].map((text) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => navigate(`/${text}`)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  transition: 'color 0.3s ease',
                  // Text color changes to white in light mode on hover/selected
                  '&:hover': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                  '&.Mui-selected': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {text === 'Help & Support' ? <SupportAgentIcon /> : <AccountBoxRoundedIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          
            <ListItem key="Logout" disablePadding sx={{ display: 'block' }} onClick={() => {localStorage.clear(); navigate('/')}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  transition: 'color 0.3s ease',
                  // Text color changes to white in light mode on hover/selected
                  '&:hover': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                  '&.Mui-selected': {
                    color: theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutRoundedIcon />
                </ListItemIcon>
                <ListItemText primary='Logout' sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          
        </List>
      </Drawer>
    </Box>
  );
}
