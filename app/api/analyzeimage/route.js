import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Securely load your API key from environment variables
});

export async function POST(req) {  // No `res` parameter in the function
  try {
    const { image } = await req.json(); // req.body if using parsed body

    const response = await openai.chat.completions.create({
      model: "gpt-4o",  
      messages: [
        { role: 'user', content: [
          {type: "text", text:"describe this image in one word."},
          {
              type: "image_url", 
              image_url: 
              {
                "url": image
              }
           }
        ]
     },
      ],
    });

    return new Response(JSON.stringify(response.choices[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}





// export default async function handler(req, res) {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, // Access your API key from environment variables
//   });

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // Make sure the model name is correct
//       messages: [{ role: "system", content: "What is your name?" }],
     
//     });

  
// }