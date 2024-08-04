'use client'
import Image from "next/image";
import { firestore } from "@/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";

import { Box, Stack, Typography } from '@mui/material'


export default function Home() {
  const [Pantry, setPantry] = useState([])
  useEffect(() => {
    const upadatePantry = async () => {
      const snapshot = query(collection(firestore, 'Pantry'))
      const docs = await getDocs(snapshot)
      const pantryList = []
      docs.forEach((doc) => {
        pantryList.push(doc.id)
      })
      console.log(pantryList)
      setPantry(pantryList)
    }
    upadatePantry()

  }, [])
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'} 
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#1ca9c9'} display={'flex'} justifyContent={'center'} alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {Pantry.map((i) => (
            <Box key={i}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
            >
              <Typography
                variant={'h3'}
                color={'#333'}
                textAlign={'center'}
              >
                {
                  // Capitalize the first letter of the item
                  i.charAt(0).toUpperCase() + i.slice(1)
                }
              </Typography>
            </Box>

          ))}

        </Stack>
      </Box>
    </Box>
  )
}
