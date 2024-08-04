import React, { useState, useRef } from "react";
import Camera from "react-camera-pro"; // Ensure this import matches the library's export
import { Box, Button } from '@mui/material';

const CameraComponent = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Camera ref={camera} aspectRatio={16 / 9} />
      <Button variant="contained" onClick={takePhoto}>Take Photo</Button>
      {image && <img src={image} alt="Captured" style={{ marginTop: '10px', maxWidth: '100%' }} />}
    </Box>
  );
};

export default CameraComponent;
