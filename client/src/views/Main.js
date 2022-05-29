import axios from "axios";
import { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage";


const Main = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(res=> { 
                setCategories(res.data.categories)
            })
            .catch(err => console.error(err))
    }, []);


    return(
        <div>
            <div>
                <LandingPage categories={categories}/>
            </div>
        </div>
    )
}

export default Main;