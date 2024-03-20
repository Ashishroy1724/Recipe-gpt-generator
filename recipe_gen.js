const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); 

const API_KEY = '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'; 

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/recipe', async (req, res) => {
  try {
    const userInput = req.query.ingredients;
    const cuisine = req.query.cuisine;
    const allergies = req.query.allergies;
   

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients mentioned.' },
        { role: 'system', content: 'The output should highlight the title in a little bit bigger text from the rest of the text and the tilte for everything should be in bold.' },
        { role: 'system', content: `Also give the recipe a suitable name in its local language based on cuisine preference and in English too at the top (${cuisine}).` },
        { role: 'system', content: `Choose the recipe by removing things mentioned in allergies section (${allergies}).` },
        { role: 'system', content: `Provide a formatted output for each recommended recipe consisting of:
                                    Title of the recipe
                                    Title of the recipe in the local language (if available)
                                    List of ingredients
                                    Cooking steps
                                    Garnishing tip (optional)` },
        { role: 'system', content: `Give the best garnishing tip suitable for the recipe at the end of output.` },
        { role: 'user', content: `Ingredients: ${userInput}` },
        { role: 'user', content: `Cuisine: ${cuisine}` },
        { role: 'user', content: `Allergies: ${allergies}` },
       
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    const recipe = response.data.choices[0].message.content.trim();
    res.json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
