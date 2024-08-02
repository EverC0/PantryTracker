'use client'
import { Container, Typography, Box, TextField, Button, Checkbox, Alert} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setUserId } from 'firebase/analytics';
import { addDoc, collection, getDocs, query, doc, setDoc, deleteDoc, count, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {collect_name} from '/keys/firebaseKey';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const page = () => {

    const router = useRouter();

    const [Login, SetLogin] = useState(false)

    const [User, SetUser] = useState('')
    const [Pass, Setpass] = useState('')
    const [Company_n, SetCompaany] = useState('')


    // handle if person is already logged In
    const auth = getAuth();
    const user = auth.currentUser;

    const handleLeave = async () => {
      await router.push('/')
    }

    if (user){
        
        return (
        <Box sx={{display:'flex', padding:4, justifyContent:'center', gap:2}}>
            <Alert severity="error">Already signed In</Alert>
            {/* <Button variant="contained" onClick={handleLeave}> Home </Button> */}
        </Box>
    )
    }


    // const handleNewPage = () => {
    //     router.push('NewAccount')
    // }
    
    const handleToggle = () => {
        SetLogin((prev) => 
            !prev,
            SetUser(''),
            Setpass('')); // Toggle the state
            SetCompaany('');
      };

    // handle creating the document with username:string, password:string, 
    const addUserWithPantry = async (User, Pass, Company_n) => {
        const auth = getAuth();

        try {
            // Create a new user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, User, Pass);
            const uid = userCredential.user.uid; // Get the user's unique ID (uid)

            // Create a reference to the user's document in the pantry collection
            const docRef = doc(firestore, collect_name, uid); // Use uid as the document ID
            // Check if the document already exists
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log('Account already exists.');
            } else {
                // Create the document with the user's uid, username, and an empty pantry tab
                await setDoc(docRef, {
                    Username: User,
                    Password: Pass,
                    Company: Company_n,
                    Pantry_tab: {} 
                });
                console.log('Company and pantry data added successfully');
            }
            } catch (e) {
                console.error('Error adding company with pantry: ', e);
            }
        };

        const handleAddUser = async () => {

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!User || !emailPattern.test(User)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!Pass || Pass.length < 7) {
                alert('Password must be at least 7 characters long.');
                return;
            }

            await addUserWithPantry(User, Pass, Company_n);
            router.push('/pantry')
        };
        
        // handles users when added
        const handleLogin = async () => {
            const auth = getAuth();
            try {
                await signInWithEmailAndPassword(auth, User, Pass);
                router.push('/pantry');
            } catch (e) {
                console.error('Error logging in: ', e);
                setError(e.message);
            }
        };


        return (
            <Container
            sx={{
            p: 3,                      // Padding around the title
            bgcolor: 'background.paper',  // Background color from the theme
            boxShadow: 3,              // Adds shadow (values range from 1 to 24)
            borderRadius: 2,           // Rounds the corners
            width: '80vh',         // Optional: Limit the width of the box
            height: '55vh',
            margin: 'auto',            // Center the box horizontally
            textAlign: 'center',       // Center the text within the box
            }}
            >
                <Box> 
                    <Box sx= {{display:'flex', justifyContent: 'center', }}>
                        <Checkbox 
                        {...label} 
                        checked={Login} 
                        onChange={handleToggle}
                        />
                    
                        <Typography
                            sx={{
                                color:'inherit',
                                fontSize: 20,
                                p:3,
                            }}
                        > 
                            {Login ? 'Login' : 'Create Account'}
                        </Typography>
                    </Box>

                    {Login ? (
                        <>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                                            
                        <Typography variant="contained" sx={{p:3}}>
                            User
                        </Typography>
                        <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={User}
                        onChange={(e) => SetUser(e.target.value)} // Update search text
                        sx={{ marginRight: 2 }}
                        />

                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>

                        <Typography variant="contained" sx={{p:3}}>
                            Password
                        </Typography>
                        <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        value={Pass}
                        onChange={(e) => Setpass(e.target.value)} // Update search text
                        sx={{ marginRight: 2 }}
                        />

                        </Box>

                        <Box sx={{ display: 'flex', justifyContent:'center',alignItems: 'center', width: '100%', marginBottom: 2, gap:2 }}>

                        <Button variant="contained" onClick={handleLogin}>Login</Button>

                        </Box>
                        </>
                    ) 
                    : (
                        <>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                        
                            <Typography variant="contained" sx={{p:1}}>
                                New User
                            </Typography>
                            <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={User}
                            onChange={(e) => SetUser(e.target.value)} // Update search text
                            sx={{ marginRight: 2 }}
                            />
                    
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                            
                            <Typography variant="contained" sx={{p:2}}>
                                Password
                            </Typography>
                            <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            value={Pass}
                            onChange={(e) => Setpass(e.target.value)} // Update search text
                            sx={{ marginRight: 2 }}
                            />
                        
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                            
                            <Typography variant="contained" sx={{p:1}}>
                                Company Name
                            </Typography>
                            <TextField
                            label="Company"
                            variant="outlined"
                            fullWidth
                            value={Company_n}
                            onChange={(e) => SetCompaany(e.target.value)} // Update search text
                            sx={{ marginRight: 2 }}
                            />
                        
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent:'center',alignItems: 'center', width: '100%', marginBottom: 2, gap:2 }}>
                            <Button variant="contained" onClick={handleAddUser} >Create</Button>
                        </Box>
                    </>
                    )
                    
                    }

                </Box>


            </Container>
    )
};

export default page


// await setDoc(doc(firestore, 'users'), {
            
//     name: User,
//     password: Pass,
//     company: Company_n,
//     pantry: {},

//     });
//     console.log('User and pantry data added successfully');