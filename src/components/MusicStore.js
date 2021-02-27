import '../App.css';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography, Toolbar, IconButton, Badge, Menu, MenuItem } from '@material-ui/core';
import { Home, ShoppingCart, ExitToApp, Face } from '@material-ui/icons'
import HomePanel from './HomePanel';
import AllSongs from './AllSongs';
import AllAlbums from './AllAbums';
function tabProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

export default function MusicStore(props){
    const [value, setValue] = React.useState(0);
    const { user } = props
    const handleTabChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
      <div>
        <AppBar position="static" color="transparent">
            <Tabs
                value={value}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                aria-label="application menu"
            >
                <Tab label="Huni" icon={<Home/>} {...tabProps(0)}/>
                <Tab label="Songs" {...tabProps(1)}/>
                <Tab label="Albums" {...tabProps(2)}/>
                <Toolbar>
                  <CartButton />
                  <MyProfileButton user={user}/>
                </Toolbar>
            </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
            <HomePanel />
        </TabPanel>
        <TabPanel value={value} index={1}>
            <AllSongs />
        </TabPanel>
        <TabPanel value={value} index={2}>
            <AllAlbums />
        </TabPanel>
      </div>
    )
}

function CartButton(){
  return (
    <IconButton
      aria-label="show cart"
    >
      <Badge badgeContent={3} color="secondary">
        <ShoppingCart />
      </Badge>
    </IconButton>
  )
}

function MyProfileButton(props){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isSubMenuOpen = Boolean(anchorEl);
  const { user } = props;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("MY USER: ", user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const MyProfileSubMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={"logged-in-user"}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isSubMenuOpen}
      onClose={handleMenuClose}
    >

      <MenuItem onClick={handleMenuClose}>Purchase History</MenuItem>
    </Menu>
  )
  return (
    <Fragment>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={"logged-in-user"}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <Face />
      </IconButton>
      {MyProfileSubMenu}
    </Fragment>
  )
}