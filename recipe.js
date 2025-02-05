const mealsEl = document.getElementById("meals");
const favContainer = document.getElementById("favMeals");

const searchMeal = document.getElementById("searchMeal");
const searchBtn = document.getElementById("search");

const recipePopup = document.getElementById("recipePopup");
const btnClose = document.getElementById("closePopup");
const mealInfo = document.getElementById("mealInfo");

const noMeal = document.getElementById("noMeal");

getRandomMeal();
fetchFavMeals();

//--------------------------------------------------- fetches randon meeal -------------------------------------------

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
}

//--------------------------------------------------- fetches meal by id -----------------------------------------------

async function getMealByID(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

//----------------------------------------------------- fetches meal by search --------------------------------------

async function getMealBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

//----------------------------------------------------- adds random meal -------------------------------------------

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
       <div class="meal">
        <div class="mealHeader">
               ${
                 random
                   ? `<span class="random"> random recipe 
               </span>`
                   : ""
               }
               <img src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
                />
             </div>
             <div class="mealBody">
                   <h4> ${mealData.strMeal}</h4>
                       <button class="showRecipe">
                        <i class="fas fa-scroll"></i>
                        </button>
                       <button class="favBtn">
                          <i class="fas fa-heart">
                          </i>
                        </button> 
                        
             </div>
             </div>
            `;

  // ------------------------------------- like/show recipe button control-----------------------------------------------

  const btn = meal.querySelector(".mealBody .favBtn");
  const showRecipe = meal.querySelector(".mealBody .showRecipe");


  btn.addEventListener("click", function () {
    if (btn.classList.contains("active")) {
      rmvMealFromLStorage(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLStorage(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeals();
  });

  showRecipe.addEventListener("click", function () {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}

// ---------------------------------------------- adds meal to storage ---------------------------------------------

function addMealToLStorage(mealId) {
  const mealIds = getMealsFromLStorage();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

// -------------------------------------------- removes meal from storage --------------------------------------------

function rmvMealFromLStorage(mealId) {
  const mealIds = getMealsFromLStorage();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

// -------------------------------------------- gets meal from storage ------------------------------------------------

function getMealsFromLStorage() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

// -------------------------------------------- stores fav meal -----------------------------------------------------

async function fetchFavMeals() {
  //----------------------------------------- cleans container ---------------------------------------------------

  favContainer.innerHTML = "";

  const mealIds = getMealsFromLStorage();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    const meal = await getMealByID(mealId);
    addMealToFav(meal);
  }
}

// ------------------------------------------------ adds fav meal to screen ----------------------------------------

function addMealToFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
    <img
    src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </img>
    <span> ${mealData.strMeal} </span>
    <button class="clear"> x </button>
    <button class="showRecipe"><i class="fas fa-scroll"></i></button>
            `;
  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", function () {
    rmvMealFromLStorage(mealData.idMeal);
     
    fetchFavMeals();
  });

  const showRecipeBtn = favMeal.querySelector(".showRecipe");
  showRecipeBtn.addEventListener("click", function () {
    showMealInfo(mealData);
  });

  favContainer.appendChild(favMeal);
}

// --------------------------------------------------- search -----------------------------------------------------------------
searchBtn.addEventListener("click", async function () {
  goToTop();
  mealsEl.innerHTML = "";
  const search = searchMeal.value;
  const meals = await getMealBySearch(search);

  if (meals) {
    meals.forEach(function (meal) {
      addMeal(meal);
      noMeal.innerHTML = "";
    });
  } else if (!meals) {
    console.log(noMeal);
    noMeal.innerHTML = "Sorry, meal not available in search.";
    noMeal.classList.add("show");
  }
});

btnClose.addEventListener("click", function () {
  recipePopup.classList.add("hidden");
});

// ---------------------------------------------------------- shows meal info ---------------------------------------
function showMealInfo(mealData) {
  mealInfo.innerHTML = "";

  //------------------------------------------------------ updates meal info ---------------------------------------
  const mealEl = document.createElement("div");

  const ingredients = [];

  // ---------------------------------------------------- gets indegridients ---------------------------------------
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]}
                - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
    <h1> ${mealData.strMeal} </h1>
    <img src="${mealData.strMealThumb}" alt="">
    <h3> Cooking Procedure </h3>
    <p> ${mealData.strInstructions} </p>
    <h3> Ingredients and Measurements </h3>
    <ul>
        ${ingredients.map((ing) => `<li> ${ing} </li>`).join("")}
    </ul>
    `;
  // ------------------------------------------------- shows meal info --------------------------------------------
  mealInfo.appendChild(mealEl);

  recipePopup.classList.remove("hidden");
}

// ---------------------------------------------------- clear search -------------------------------------------------
const clear = document.querySelector(".clear");
clear.addEventListener("click", function () {
  getRandomMeal();

  mealsEl.innerHTML = "";
  searchMeal.value = "";
  noMeal.innerHTML = "";
goToTop();
});
  
//-------------------------------------------------- back to top scroll func ----------------------------------------------------

window.onscroll = function () {
  scrollFunc();
};

function scrollFunc() {
  const btn = document.querySelector(".clear");
  const scroll_btn = document.querySelector(".onscroll");
  if (document.body.scrollTop > 15 || document.documentElement.scrollTop > 15) {
    scroll_btn.style.display='inline-block';
    btn.style.display='none'
    scroll_btn.addEventListener("click", function () {
    goToTop()})
  } else {
    btn.style.display='inline-block'
    scroll_btn.style.display='none'
  }
}

function goToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
