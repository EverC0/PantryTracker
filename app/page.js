import { Container, Typography, Box } from '@mui/material';
import Header from './components/Header'
import Login from './LogIn/page'

export default function Home() {
  return (
    <>
     
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2, gap: 6 }}>


      <Box
        sx={{
          p: 3,                      // Padding around the title
          bgcolor: 'background.paper',  // Background color from the theme
          boxShadow: 3,              // Adds shadow (values range from 1 to 24)
          borderRadius: 2,           // Rounds the corners
          maxWidth: '600px',         // Optional: Limit the width of the box
          margin: 'auto',            // Center the box horizontally
          textAlign: 'center',       // Center the text within the box
        }}
        >

        <Typography
          variant="H1"
          sx={{
            color: 'gray',  // Title color
            fontSize:'4vh',     // Make the title bold
          }}
        >
          <strong>Welcome to Pantry Storage</strong>
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,                      // Padding around the title
          bgcolor: 'background.paper',  // Background color from the theme
          boxShadow: 3,              // Adds shadow (values range from 1 to 24)
          borderRadius: 2,           // Rounds the corners
          maxWidth: '600px',         // Optional: Limit the width of the box
          margin: 'auto',            // Center the box horizontally
          textAlign: 'center',       // Center the text within the box
        }}
        >
        <Typography
            variant="body1"
            sx={{ 
              fontFamily: 'inherit', // Inherit font from global or parent styles
              marginTop: 1,
            }}
          >
            This application allows you to store and manage your pantry inventory in a database. 
            You can easily view your inventory using the View tab. Keep track of your items 
            and manage your stock efficiently!
          </Typography>

          <Typography
          variant="body1"
          sx={{ 
            fontFamily: 'inherit', // Inherit font from global or parent styles
            marginTop: 1,
          }}
        >
          <strong>New Feature:</strong> We've integrated OpenAI to enhance your experience further. 
          This addition provides intelligent suggestions, insights, or even automation, making your pantry management smarter and more intuitive.
        </Typography>


      </Box>

      <Login/>


      </Container>
      
    </>
  );
}
