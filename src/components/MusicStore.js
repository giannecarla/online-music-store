import '../App.css';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography, Toolbar, IconButton, Badge, Menu, MenuItem } from '@material-ui/core';
import { Home, ShoppingCart, ExitToApp, Face } from '@material-ui/icons'
import HomePanel from './HomePanel';
import AllSongs from './AllSongs';
import AllAlbums from './AllAbums';
import CartPanel from './CartPanel';
import FirebaseClient from '../FirebaseClient';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import PurchaseHistory from './PurchaseHistory';
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
    const [showCartPanel, setShowCartPanel] = React.useState(false);
    const [ cartItemCtr, setCartItemCtr ] = React.useState(0)
    const [showPurchaseHistory, setShowPurchaseHistory] = React.useState(false);
    const [isNavOnTabs, setIsNavOnTabs] = React.useState(true);
    const { user } = props;

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        setShowCartPanel(false);
        setShowPurchaseHistory(false);
        setIsNavOnTabs(true);
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
            </Tabs>
            <Toolbar>
              <CartButton 
                onClick={(e) => {
                  setIsNavOnTabs(false);
                  setShowCartPanel(true);
                  setShowPurchaseHistory(false);
                }}
              />
              <MyProfileButton 
                onClickHistory={(e) => {
                  setIsNavOnTabs(false);
                  setShowCartPanel(false);
                  setShowPurchaseHistory(true);
                }}/>
            </Toolbar>
        </AppBar>
        { isNavOnTabs &&
          <Fragment>
            <TabPanel value={value} index={0}>
                <HomePanel />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AllSongs />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AllAlbums />
            </TabPanel>
          </Fragment>
        }
        {showCartPanel && <CartPanel />}
        {showPurchaseHistory && <PurchaseHistory />}
      </div>
    )
}

function CartButton(props){
  const cartRef = FirebaseClient.store.collection('carts');
  const { uid } = FirebaseClient.auth.currentUser;
  const cartQuery = cartRef.where('userId', '==', uid ).where('isDeleted', '==', false);
  const [ cartItems ] = useCollectionData(cartQuery, {idField: "id"});
  const cartItemsCtr = cartItems && cartItems.length;
  return (
    <IconButton
      aria-label="show cart"
      onClick={props.onClick}
    >
      <Badge badgeContent={cartItemsCtr} color="secondary">
        <ShoppingCart />
      </Badge>
    </IconButton>
  )
}

function MyProfileButton(props){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isSubMenuOpen = Boolean(anchorEl);
  const { user, onClickHistory} = props;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("MY USER: ", user);
  };

  const handleClickHistory = () => {
    setAnchorEl(null);
    onClickHistory && onClickHistory()
  };

  const MyProfileSubMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={"logged-in-user"}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isSubMenuOpen}
      onClose={handleClickHistory}
    >

      <MenuItem onClick={handleClickHistory}>Purchase History</MenuItem>
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