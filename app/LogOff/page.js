"use client";


import { Box, Stack, Typography, Button, Modal, TextField, Alert, Container} from "@mui/material";
import { firestore } from "@/firebase"; 
import { addDoc, collection, getDocs, query, doc, setDoc, deleteDoc, count, getDoc, updateDoc, increment, deleteField } from "firebase/firestore";
import { useEffect, useState } from "react";
import { set } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const Page = () => {
    const auth = getAuth();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const logOff = async () => {

        try {
            await signOut(auth);
            console.log(auth.currentUser)
            console.log('User logged out successfully.');
            router.push('/'); // Redirect to the login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // const fetchCompletion = async () => {
    //     try {
    //       const res = await fetch('/api/page.js', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ data: "your data" }),
    //       });
    //       const data = await res.json();
    //       setResponse(data.completion);
    //     } catch (error) {
    //       console.error("Error fetching completion:", error);
    //     }
    //   };
    


    return (
        <Container sx={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}>
            <Box>
                <Button variant="contained"onClick={handleOpen}>Hop off</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="child-modal-title">Are you sure you want to log off?</Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="error" onClick={logOff}>
                                Log Off
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>

            {/* <Button variant="contained" color="primary" onClick={fetchCompletion}>
                Fetch Completion
            </Button>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
                {response}
            </Typography> */}


        </Container>
     
    )
}

export default Page
