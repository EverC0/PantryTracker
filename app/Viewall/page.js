"use client"

import { Box, Stack, Typography, Button, Modal, TextField, Container, Alert}  from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { firestore } from "@/firebase"; 
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/navigation';


import React from 'react'
import { collection, getDocs, query, getDoc, doc } from "firebase/firestore";

const Viewall = () => {

    const router = useRouter();
    const [rows, setRows] = useState([])
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const auth = getAuth();

    const user = auth.currentUser
    // const [columns, setColumns] = useState([])

    const handleLeave = async () => {
        await router.push('/')
    }

    const updatePantry = async () => {

        if (!user) {
            setError("You must be signed in to view your pantry.");
            return;
        }

        try {
            const docRef = doc(firestore, process.env.NEXT_PUBLIC_COLLECT_NAME, user.uid);
            const docs = await getDoc(docRef);

            if (docs.exists()) {
                const cur_map = docs.data().Pantry_tab;
                const fetchedRows = [];

                Object.keys(cur_map).forEach((key) => {
                    fetchedRows.push({
                        id: key,          // Use the key as the ID
                        count: cur_map[key], // The value is the count
                    });
                });

                setRows(fetchedRows);
            } else {
                console.log("No pantry data found for this user.");
            }
        } catch (error) {
            console.error("Error fetching pantry data:", error);
            setError("Failed to fetch pantry data.");
        }
    };

    useEffect(() => {
    updatePantry()
  }, []);

    // Conditionally render based on whether there's an error
    if (error) {
        return (
            <Box sx={{display:'flex', padding:4, justifyContent:'center', gap:2}}>
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" onClick={handleLeave}>Home</Button>
            </Box>
        );
    }

    const columns = [
        { field: 'id', headerName: 'Document ID', width: 200 },
        { field: 'count', headerName: 'Count', type: 'number', width: 130 },
      ];


    const handleSearch = () => {
    if (searchText) {
        const filteredRows = rows.filter((row) =>
        row.id.toLowerCase().startsWith(searchText.toLowerCase())
        );
        setRows(filteredRows);
    } else {
        setRows(rows); // Reset to original rows if search text is cleared
    }
    };

      

      const handleReset = () => {
        setSearchText('');  // Clear search text
        setRows(rows);  // Reset to original rows
        updatePantry()

    };

    
    // useEffect(() => {
    // updatePantry()
    // }, [])


    return (
        <Container 
            sx={{
                display: 'flex',
                flexDirection: 'column',   // Ensure the children are stacked vertically
                alignItems: 'center',      // Center content horizontally
                justifyContent: 'flex-start', // Align content to the top of the container
                padding: 3,                // Add padding inside the container
                height: '100vh',           // Set height to full viewport height
            }}
        >

            <Typography
                variant="h4" // Set the typography variant to h4 for a title-like appearance
                sx={{ marginBottom: 3, color: 'gray' }} // Add space below the title
            >
                Pantry Data View
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                <TextField
                label="Search by Document ID"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)} // Update search text
                sx={{ marginRight: 2 }}
                />
                <Button variant="contained" onClick={handleSearch} >
                Search
                </Button>
            </Box>


            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={rows.length}
                    rowsPerPageOptions={[rows.length]} // Only allow the total number of rows as the page size option
                    checkboxSelection
                    disableSelectionOnClick
                    autoHeight
                />
                <Button variant="contained" onClick={handleReset} sx={{marginTop:-9.7, marginLeft:1}}>
                    Reset
                </Button>
            </Box>

        </Container>
    )
}

export default Viewall


// initialState={{
//                         pagination: {
//                             paginationModel: { page: 0, pageSize: 5 },
//                         },
//                         }}
//                         pageSizeOptions={[5, 10]}
//                         checkboxSelection


  //   useEffect(() => {
    //     const fetchData = async () => {
    //       // Fetch all documents from the specified Firestore collection
    //       const querySnapshot = await getDocs(collection(firestore, 'yourCollectionName'));
    //       console.log("Fetched Documents:", querySnapshot.docs.map(doc => doc.data()));
    //       // Map each document to a format suitable for the DataGrid rows
    //       const fetchedRows = querySnapshot.docs.map((doc) => ({
    //         id: doc.id, // The document ID
    //         count: doc.data().count, // The count field from the document
    //       }));
          
    //       // Set the rows state with the fetched data
    //       setRows(fetchedRows);
    //     };
    
    //     fetchData();
    //   }, []);
