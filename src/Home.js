import React, { useState } from 'react';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipe, setRecipe] = useState([]);
  const [instructions, setInstructions] = useState(null);

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
      console.log(ingredients)
    }
  }
  const handleGenerateRecipe = async() => {
      const apiKey = "dfdb77a0c66143639911e30c30c896fd";
      const url = "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+ingredients+"&number=5&apiKey="+apiKey;
      try {
        const response = await fetch(url);
        if(!response.ok) {
            return "Cannot find recipe"
        }
        const data = await response.json();
        setRecipe(data);
      } catch(error) {
        console.log(error)
      }
  }
  const handleGiveRecipe = async(recipeId) => {
    const apiKey = "dfdb77a0c66143639911e30c30c896fd";
    const url = "https://api.spoonacular.com/recipes/"+recipeId+"/information?apiKey="+apiKey;
    try {
      const response = await fetch(url);
      if(!response.ok) {
          return "Cannot find recipe"
      }
      const data = await response.json();
      setInstructions(data);
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>What's in Your Pantry?</h1>
      </header>
      <div className="container">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Add a new ingredient"
        />
        <button onClick={handleAddIngredient}>Add Ingredient</button>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <div>
        <button onClick={handleGenerateRecipe}>Generate Recipe</button>
          <h2>Recipes</h2>
            <ul>
              {recipe.map((recipe) => (
                <li key={recipe.id}>
                  <button onClick={()=>handleGiveRecipe(recipe.id)}>{recipe.title}</button>
                  <img src={recipe.image} alt={recipe.title} />
                </li>
              ))}
            </ul>
        </div>
        {instructions && (
          <div>
            <h2>{instructions.title}</h2>
            <img src={instructions.image} alt={instructions.title} />
            <h3>Instructions</h3>
            <p>{instructions.instructions}</p>
          </div>
        )}
        </div>
    </div>
  )
}
export default App;