import style from '../views/style.css';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = (props) => {
    const [currCat, setCurrCat] = useState("");             //*CURRENT CATEGORY
    const [catMeals, setCatMeals] = useState([]);           //*CURRENT CATEORY-MEALS
    const [ready, setReady] = useState(false);              //*ONCE CATEGORY & MEALS ARE LOADED
    const [meal, setMeal] = useState([]);                   //*CURRENT MEAL
    const [currIngred, setCurrIngred] = useState([]);       //*CURRENT MEAL INGREDIENTS
    const [currAmt, setCurrAmt] = useState([]);             //*CURRENT MEAL INGREDIENT MEASUREMENTS
    const [finish, setFinish] = useState(false);            //*ONCE MEAL LOADS
    const [sidebarOpen, setSideBarOpen] = useState(false);  //*OPENS SIDEBAR WITH MEAL INFO
    const [search, setSearch] = useState("");               //*HOLDS WHAT IS BEING TYPED IN SEARCH BAR
    const [recipe, setRecipe] = useState(false);            //*OPENS FULL PAGE RECIPE WHEN SET TO TRUE. CLOSED OTHERWISE

    //*METHODS
    const currentCat = (value) => {
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`)
            .then(res=> {
                setCurrCat(value)
                setCatMeals(res.data.meals)
                setReady(true);
            })
            .catch(err=>console.error(err))
    }

    const currMeal = (value) => {
        axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`)
            .then(res=> {
                setMeal(res.data.meals[0]);
                let ingredients = []
                for(let i=1; i<=20; i++){
                    for(const [key, value] of Object.entries(res.data.meals[0])){
                        let single = "strIngredient" + i;
                        if(key === single){
                            if(value !== '' && value !== null){
                                ingredients.push(`${value}`)
                            }
                        }
                    }
                }
                setCurrIngred(ingredients);
                let measure = [];
                for(let i=1; i<=20; i++){
                    for(const [key, value] of Object.entries(res.data.meals[0])){
                        let singleVal = "strMeasure" + i;
                        if(key === singleVal){
                            if(value !== '' && value !== null){
                                measure.push(`${value}`)
                            }
                        }
                    }
                }
                setCurrAmt(measure);
                setFinish(true);
                setSideBarOpen(true);
            })
            .catch(err=>console.error(err))
    }

    const randMeal = () => {
        axios.get(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(res=> {
                setMeal(res.data.meals[0])
                setFinish(true);
                setSideBarOpen(true);
                let ingredients = []
                for(let i=1; i<=20; i++){
                    for(const [key, value] of Object.entries(res.data.meals[0])){
                        let single = "strIngredient" + i;
                        if(key === single){
                            if(value !== '' && value !== null){
                                ingredients.push(`${value}`)
                            }
                        }
                    }
                }
                setCurrIngred(ingredients);
                let measure = [];
                for(let i=1; i<=20; i++){
                    for(const [key, value] of Object.entries(res.data.meals[0])){
                        let singleVal = "strMeasure" + i;
                        if(key === singleVal){
                            if(value !== '' && value !== null){
                                measure.push(`${value}`)
                            }
                        }
                    }
                }
                setCurrAmt(measure);
            })
            .catch(err=>console.error(err))
    }

    const handleViewSidebar = () => {
        if(sidebarOpen === false){
            setSideBarOpen(true);
        }
        if(sidebarOpen === true) {
            setSideBarOpen(false);
        }
    };

    const searchResult = (e) => {
        e.preventDefault();
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${search}`)
        .then(res=> {
            setCurrCat(search);
                setCatMeals(res.data.meals);
                setReady(true);
                setSearch("");
            })
            .catch(err=>console.error(err))
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const fullRecipe = () => {
        setSideBarOpen(false);
        setRecipe(true);
    }

    const backToMain = () => {
        setRecipe(false);
    }

    return (
        <>
            <div className="header flex sp-btw">
                <div className='hidden'>
                </div>
                <div>
                    <h2 className="header-link">Recipe Genie</h2>
                </div>
                <div className="padding-right-10">
                    <form onSubmit={searchResult}>
                        <input type="text" placeholder="Search by Main Ingredient" id="search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                        <input type="submit" value="Search" id="button"/>
                    </form>
                </div>
            </div>
            {meal && finish && sidebarOpen ?
            <div className="Sidebar body">
                <div className='flex right'>
                    <button className="sidebar-icon sidebar-burger" onClick={handleViewSidebar}>X</button>
                </div>
                <div className="sidebar-header centered body">
                    <h1 className="sidebar-logo center body">{meal.strMeal.toUpperCase()}</h1>
                </div>
                <div className='all-ingreds marg-left-10 marg-right-10 padding-left-10 padding-right-10'>
                <div className="flex body just-cent padding-top-20">
                    <div className="marg-right-20">
                        <img src={meal.strMealThumb} id="recipepic"/>
                    </div>
                    <div className="marg-left-20">
                        INGREDIENTS:
                        <div className="flex ingreds">
                            <div>
                            {currIngred.map((ingred, i)=>
                                <div key={i}>
                                    <li className="line-spc">{capitalizeFirstLetter(ingred)}</li>
                                </div>)}
                            </div>
                            <div className='marg-right-20'>
                            {currAmt.map((amt, i)=>
                                <div key={i}>
                                    <span className="line-spc marg-left-10">{amt}</span>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="padding-left-10 padding-right-10 line-spc body">
                    <p>INSTRUCTIONS: <br />
                    <span className='text'>{meal.strInstructions}</span></p>
                </div>
                </div>
                <div className='center marg-top-10'>
                    <Link onClick={fullRecipe} className='body full-rec-link' id="rec-title">VIEW FULL RECIPE HERE</Link>
                </div>
            </div> : <></> }
            <div className='colored'>
            {recipe ?
                <div className='page-width centered frosty'>
                    <div className='full-recipe centered frosty'>
                        <div className='flex just-cent cursive centered'>
                            <div className='center'>
                            </div>
                        </div>
                        <div className="body flex sp-btw">
                            <div className='hidden-2'>
                            </div>
                            <div>
                                <h1 className="land-box-title center cursive big-marg-top">{meal.strMeal}</h1>
                            </div>
                            <div className='right marg-right-10'>
                                <button onClick={backToMain} className='dropbtn-2 big-marg-top' id='surprise'>Go Back</button>
                            </div>
                        </div>
                        <div className='marg-left-10 marg-right-10 padding-left-10 padding-right-10'>
                            <div className="flex body just-left marg-left-20 padding-left-10 padding-right-10">
                                <div>
                                    <img src={meal.strMealThumb} id="mainrecipepic"/>
                                </div>
                                <div className='marg-left-20 padding-left-10'>
                                    <div>
                                        <span id="med-text">INGREDIENTS:</span>
                                        <div className="flex full-ingred sp-btw" id="small-text">
                                            <div>
                                            {currIngred.map((ingred, i)=>
                                                <div key={i}>
                                                    <li className="line-spc">{capitalizeFirstLetter(ingred)}</li>
                                                </div>)}
                                            </div>
                                            <div>
                                            {currAmt.map((amt, i)=>
                                                <div key={i}>
                                                    <span className="line-spc marg-left-10">{amt}</span>
                                                </div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="padding-left-10 padding-right-10 line-spc body marg-left-20 marg-right-20 move-up padding-bottom-10 marg-bottom-10">
                                <p id="med-text">INSTRUCTIONS: <br />
                                <span id="small-text">{meal.strInstructions}</span></p>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>:
                <div className='page-width centered frosty'>
                    <div className='flex just-cent cursive centered'>
                        <div className='center'>
                        </div>
                    </div>
                    <div className='padding rand-box body center marg-top-20'>
                        <h3 className='land-box-title-2 cursive marg-bottom-10'>Let us pick a meal for you!</h3>
                        <button className='body dropbtn marg-bottom-20' id='surprise' onClick={randMeal}>SURPRISE ME!</button>
                    </div>
                    <hr className='divider'/>
                    <h3 className='land-box-title cursive center'>Browse by Category:</h3>
                    <div className='flex carousel frosty'>
                    {props.categories.map((cat, i)=>
                        <div key={i} className="center marg-bottom-10 categories">
                            <Link onClick={(e)=>{currentCat(cat.strCategory)}} className="rec-link">
                                <img src={cat.strCategoryThumb} alt="category" id="catpic"/>
                                <span className='body' id="rec-title">{cat.strCategory.toUpperCase()}</span>
                            </Link>
                        </div>
                    )}
                    <br />
                    </div>
                    <hr className='divider'/>
                    <div className='marg-top-20'>
                    {currCat ?
                        <h2 className="center cat-title padding-bottom-20 cursive">{capitalizeFirstLetter(currCat)}</h2>
                        : <h2 className="center cat-title padding-bottom-20 cursive">Recipes</h2>}
                        <div className="flex recipes centered frosty">
                        {ready && catMeals ?
                        catMeals.map((rec, i) => {
                            return <div key={i} className="scroll">
                                <div className="center">
                                    <img src={rec.strMealThumb} id="subpic"/>
                                </div>
                                <div className="recipe-title center">
                                    <Link className="rec-link" id="rec-title" onClick={(e)=>{currMeal(rec.idMeal)}}>
                                        {rec.strMeal.toUpperCase()}
                                    </Link>
                                </div>
                            </div> }) :
                            <div className='centered holder'>CLICK ON A CATEGORY</div> }
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div> }
            </div>
        </>
    )
}

export default LandingPage;