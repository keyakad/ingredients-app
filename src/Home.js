import { collection, addDoc, getDocs, doc,where, query, deleteDoc} from "firebase/firestore";
import { auth, db } from './firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import './Home.css'; 

function IngredientCategory({user,ingredients,setIngredients}) {
  const [newIngredient, setNewIngredient] = useState('');
  const [expiration, setExpiration] = useState('');
  useEffect(() => {
    if (user) {
      const getDocsFromDb = async() => {
        try {
          const q = query(collection(db, "ingredients"), where("userId", "==", user.uid))
          const ingDoc = await getDocs(q);
          const fetchedIngr = ingDoc.docs.map((doc) => ({
            ...doc.data(), id: doc.id}));
          setIngredients(fetchedIngr);
          } catch (e) {
              console.error("Error fetching ingredients",e);
            }
      }
    getDocsFromDb();
    } else {
      setIngredients([]);
    }
  }, [user, setIngredients]);
  const addIngredient = async() => {
    if (user) {
      if (newIngredient.trim() !== '') {
        try {
          const ingRef = await addDoc(collection(db, "ingredients"), {
            userId: user.uid,
            ingredient: newIngredient,
            expiration: expiration
          });
          const ingr = [...ingredients,{ id: ingRef.id, userId: user.uid, ingredient: newIngredient, expiration }]
          setIngredients(ingr);
          setNewIngredient('');
          setExpiration('');
        } catch (e) {
          console.error("Error: ", e);
        }
      }
    }
  }

  const deleteIng = async(id) => {
    try {
      await deleteDoc(doc(db,"ingredients",id))
      const update = ingredients.filter(ingredients => ingredients.id !== id);
      setIngredients(update);
    } catch {
        console.error("Error deleting");
    }
  }

  return(
    <div className='ingredient'>
    <input
      type="text"
      value={newIngredient}
      onChange={(e) => setNewIngredient(e.target.value)}
      placeholder="Add a new ingredient"
    />
    <input
      type="text"
      value={expiration}
      onChange={(e) => setExpiration(e.target.value)}
      placeholder="Expiration (YYYY-MM-DD)"
    />
      <button className = "add" onClick={addIngredient}>Add Ingredient</button>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li className= "ingList" key={index}>{ingredient.ingredient}
               <p>{ingredient.expiration}</p>
              <button className = "deleter" onClick={()=>deleteIng(ingredient.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
  )
}

function RecipeDisplay({ingredients}) {
  const [recipe, setRecipe] = useState([]);
  const [instructions, setInstructions] = useState(null);
  const [protein, setProtein] = useState(null);
  const [vitaminC, setVitaminC] = useState(null);
  const [calories, setCalories] = useState(null);
  const handleGenerateRecipe = async() => {
    const apiKey = "bfb8ca3264224fa4a8946a0e30119d84";
    const ingrList = ingredients.map(ing=>ing.ingredient).join(",");
    const url = "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+ingrList+"&number=5&apiKey="+apiKey;
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
  const handleGiveRecipe = async(recipeId,recipeTitle) => {
    const apiKey = "bfb8ca3264224fa4a8946a0e30119d84";
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
    const apikey = "4e4fa74380cb873270b9ea616debc721";
    const app_id = "959db376"
    const url2 = "https://api.edamam.com/search?q="+recipeTitle+"&app_id="+app_id+ "&app_key="+apikey;
    try {
      const response = await fetch(url2);
      if(!response.ok) {
          return "Cannot find recipe"
      }
      const d = await response.json();

      const r = d.hits[0].recipe;
      const proteinContent = r.totalNutrients.PROCNT.quantity;
      const vitaminCContent = r.totalNutrients.VITC.quantity;
      const calorieContent = r.totalNutrients.ENERC_KCAL.quantity;
      setProtein(proteinContent);
      setVitaminC(vitaminCContent);
      setCalories(calorieContent)

    } catch(error) {
      console.log(error)
    }
  }
  return(
    <div className="recipeDisplay"> 
      <div className="recipeLook">
        <button className = "add" onClick={handleGenerateRecipe}>Generate Recipe</button>
          <h2>Recipes</h2>
            <ul>
              {recipe.map((recipe) => (
                <li key={recipe.id}>
                  <button className= "recipe-button" onClick={()=>handleGiveRecipe(recipe.id,recipe.title)}>{recipe.title}</button>
                  <img src={recipe.image} alt={recipe.title} />
                </li>
              ))}
            </ul>
      </div>
      <div className="instructions">
        {instructions && (
          <div>
            <h2>{instructions.title}</h2>
            <img src={instructions.image} alt={instructions.title} />
            <h3>Instructions</h3>
            <p>{instructions.instructions}</p>
            <h3>Nutrition</h3>
            {protein && (
              <p>Protein Content: {protein} grams
              </p>
            )}
            {vitaminC && (
              <p>Vitamin C Content: {vitaminC} milligrams
              </p>
            )}
            {calories && (
              <p>Calories: {calories} KCAL
              </p>
            )}
          </div>
          )}
      </div>
    </div>
  )
}

function Home() {
  const [user, setUser] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
          setUser(null);
          navigate("/login");
      }
    });
  }, [navigate]);
  
  const signOut = async() => {
    setUser(null)
    navigate("/login");
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>What's in Your Pantry?</h1>
      </header>
      <div className="container">
        <IngredientCategory user={user} ingredients={ingredients} setIngredients={setIngredients}/>
        <RecipeDisplay ingredients={ingredients}/>
        <button className = "signOut" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  )
}
export default Home;