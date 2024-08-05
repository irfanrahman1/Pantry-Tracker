'use client'
import Image from "next/image";
import { firestore } from "@/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Box, Stack, Typography, Button, Modal, TextField, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraComponent from './components/CameraComponent'; // Importing CameraComponent

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [Pantry, setPantry] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [notification, setNotification] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleNotificationClose = () => setNotification('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'Pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item, qty) => {
    const docRef = doc(collection(firestore, 'Pantry'), item);
    // Check if exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + qty });
    } else {
      await setDoc(docRef, { count: qty });
    }
    await updatePantry();
    setNotification(`Added ${qty} ${item}(s)`);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'Pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
    setNotification(`Removed 1 ${item}`);
  };

  const updateItemQuantity = async (item, newQty) => {
    const docRef = doc(collection(firestore, 'Pantry'), item);
    await setDoc(docRef, { count: newQty });
    await updatePantry();
    setEditOpen(false);
    setNotification(`Updated ${item} quantity to ${newQty}`);
  };

  const filteredPantry = Pantry.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Box display="flex" justifyContent="center" alignItems="center" mb={2} width="800px">
        <TextField
          id="search-bar"
          label="Search Pantry"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginRight: 1 }}
        />
        <Button size="small" variant="contained">Search</Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="quantity-basic"
              label="Quantity"
              variant="outlined"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, quantity);
                setItemName('');
                setQuantity(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <Typography>{editItem?.name}</Typography>
            <TextField
              id="edit-quantity-basic"
              label="Quantity"
              variant="outlined"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                updateItemQuantity(editItem.name, quantity);
                setQuantity(1);
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add</Button>
      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#1ca9c9'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredPantry.map(({ name, count }) => (
            <Box key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography
                variant={'h3'}
                color={'#333'}
                textAlign={'center'}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {count}
              </Typography>
              <Box>
                <IconButton onClick={() => handleEditOpen({ name, count })}>
                  <EditIcon />
                </IconButton>
                <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      {/* <CameraComponent /> CameraComponent included here */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification}
      />
    </Box>
  );
}
