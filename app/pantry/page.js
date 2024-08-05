"use client";


import { Box, Stack, Typography, Button, Modal, TextField, Alert} from "@mui/material";
import Image from 'next/image';
import { firestore } from "@/firebase"; 
import { addDoc, collection, getDocs, query, doc, setDoc, deleteDoc, count, getDoc, updateDoc, increment, deleteField } from "firebase/firestore";
import { use, useEffect, useState } from "react";
import { set } from "firebase/database";
import { getAuth } from "firebase/auth";
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
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3
};

const Pantrytab = () => {

  const router = useRouter();

    const [pantry, setPantry] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [itemName, setItemName] = useState('')

    const [ImageS, setImage] = useState('')
    const [responseG, setResponse] = useState('')

    const auth = getAuth();

    const user = auth.currentUser;

    const handleLeave = async () => {
      await router.push('/')
    }

    if (!user){
        
        return (
        <Box sx={{display:'flex', padding:4, justifyContent:'center', gap:2}}>
            <Alert severity="error">This is an error Alert. Must be signed In</Alert>
            <Button variant="contained" onClick={handleLeave}> Home </Button>
        </Box>
    )
    }

    const updatePantry = async () => {

        if (user){
          const docRef = doc(firestore, process.env.NEXT_PUBLIC_COLLECT_NAME, user.uid); // Use the user's UID to reference their specific document
          const docSnap = await getDoc(docRef);

          const pantryData = docSnap.data().Pantry_tab; // Assuming Pantry_tab is an object
          const pantryList = Object.keys(pantryData).map((key) => ({
            name: key,
            quantity: pantryData[key],
          }));
          // console.log("Pantry List:", pantryList);
          setPantry(pantryList);
        } else{
          console.log('User not authenticated');
        }
    }

    // useEffect(() => {
    //   console.log(pantry)
    // }, [])


  const addItem = async (itemName) => {

    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    // docRef is a reference to a specific document in Firestore. 
    // It points to a location in your Firestore database but doesn't actually contain any data itself.
    // Create/Update a Document: You can use docRef with setDoc or updateDoc to create or update a document directly without needing to retrieve the data first.
    // Get the Data: You use getDoc(docRef) to fetch the data from Firestore 
    // if you want to inspect or use the current contents of the document
    // 
    // Fetching the Document Data with getDoc

    // docRef: This is a reference or pointer to a document in Firestore. It's like having the address of a document but not the actual content. You can't access .data() or manipulate the data directly from docRef; you need to perform specific operations like getDoc, setDoc, or updateDoc.

    // setDoc and updateDoc: These are used to write data to Firestore at the location pointed to by docRef. You don't need to fetch the document with getDoc before using these, unless you need to base your updates on the current data.

    // getDoc: This is used to fetch the data of the document from Firestore so you can inspect it, check if it exists, or use the data in your logic.

    const docRef = doc(collection(firestore, process.env.NEXT_PUBLIC_COLLECT_NAME), user.uid); // Reference to the user's pantry document

    try {
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Check if the item already exists in Pantry_tab
        const pantryData = docSnap.data().Pantry_tab || {};
  
        // Update the item count
        await updateDoc(docRef, {
          [`Pantry_tab.${itemName}`]: increment(1), // Update the item count using Firestore's atomic increment

        });
      } else {
        // If the document doesn't exist, create it with the item
        await setDoc(docRef, {
          Pantry_tab: {
            [itemName]: 1, // Initialize with count 1
          }
        });
      }
      
      await updatePantry(); 
  
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {

    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const docRef = doc(collection(firestore, process.env.NEXT_PUBLIC_COLLECT_NAME), user.uid);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const pantryData = docSnap.data().Pantry_tab || {};
      const count = pantryData[item];

      if (count === 1){
        // await docSnap.data().Pantry_tab.remove(item) not remove
        await updateDoc(docRef, {
          [`Pantry_tab.${item}`]: deleteField(), // Remove the field entirely
      });

      } else if (count > 1) {
            // Decrement the count if greater than 1
            await updateDoc(docRef, {
                [`Pantry_tab.${item}`]: count - 1,
            });
        } else {
            console.error("Invalid count or item does not exist.");
        }
    }
    await updatePantry()
  }

  async function handleSubmit(event){
    event.preventDefault();
    if(ImageS === ""){
      alert("upload an image")
      return;
    }

    try {
      const response = await fetch("/api/analyzeimage", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: ImageS, // base64
        }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      // console.log("Full response data:", data);
      
      // Accessing the content of the message from the assistant
      const description = data.message?.content?.trim(); // Using optional chaining and trim() to clean up any extra spaces
      console.log("Description:", description);
      
      setResponse(description); // Assuming `setResponse` is a state setter
      setItemName(responseG);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your request.");
    }
  }

  // usestate to hold a base64 string
  // usestate to hold the chatgot response
  // const [Image, setImage] = useState('')
  // const [response, setResponse] = useState('')

  //image upload logic
  // 1.user upload image
  // 2. we can take image and convert it inyo a based64 string
  //  what is base64, it is a string Ajsajk"" that represents en entire image
  // 3. when we request the api route we create, we will pass the image (string) to the backend

  function handleFilechnage(event){

      if(event.target.files === null){
        window.alert("no file selected choose a file")
        return;
      }
      const file = event.target.files[0]
      //covert the user file locally to a base64 string 
      // FileReader
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (typeof reader.result === "string"){
          // console.log()
          setImage(reader.result);
        }
      }

      reader.onerror = () => {
        console.error("There was an error reading the file");
      };
    }

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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

            <Typography id="modal-modal-title" variant="h6" component="h2" >
              Add to Item
            </Typography>

            {
              ImageS !== "" ?
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <Image 
                  src={ImageS}
                  alt="A description of the image" 
                  layout="responsive" 
                  width={500} 
                  height={300}
                  className="object-contain max-h-72"
                />
              </Box>
            :
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                Once you upload an image you will see.
              </Box>

            }
            
            <Box component="form" onSubmit={(e) => handleSubmit(e)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Upload Image
                </Typography>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    handleFilechnage(e)
                  }}
                />
              </Box>

              <Button type="submit">
                start               
              </Button>

            </Box>


            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField 
                id="outlined-basic" 
                label="Add Name" 
                variant="outlined" 
                spacing={2} 
                fullWidth
                value={responseG}
                // onChange={(e) => setItemName(responseG)}
                
                />
              <Button 
                variant="outline" 
                onClick={() => {
                  addItem(responseG)
                  setItemName('')
                  handleClose()
                }}
              > Add </Button>
            </Stack>
          </Box>
        </Modal>

      <Box
        display={'flex'}
        gap={3}>
        <Button variant="contained" onClick={handleOpen}>Add item</Button>
        {/* <Button variant="contained" onClick={handleOpen}>search Item</Button> */}

      </Box>

      
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#d3d3d3'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography
            variant={"h2"}
            color={"#333"}
            textAlign={"center"}
            >
              Pantry

          </Typography>

        </Box>

        {/* stacj of items hroixaonly or vertically */}
        
        <Stack width="800px" height="300px" spacing={2} overflow={'scroll'}>
          
          {pantry.map(({name, quantity}) => (

            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'} 
              paddingX={5}    
            >
              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'center'}>
                {
                  // Capitalize the first lette rof the item
                  name.charAt(0).toUpperCase() + name.slice(1)

                }
              </Typography>

              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'center'}

                > 
                Quantity: {quantity}
              </Typography>

              <Button variant="contained" onClick={ () => removeItem(name)}>
                Remove               
              </Button>

            </Box>
          ))}

        </Stack>
      </Box>
    </Box>
)}
export default Pantrytab


{/* <form>
  <div className="flex flex-col mb-6">
    <label className="mb-2 text-sm font-medium"> Upload Image</label>
    <input
    type="file"
    className="text-sm border rounded-lg cursor-pointer">
    </input>

  </div>
</form> */}