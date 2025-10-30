//1. Skapar en funktion för att hämta måltiderna från databasen
async function fetchFirstFiveMeals(){
  //2. En variabel för när vi hämtar datan. Await gör så att programet väntar tills datan har hämtats
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a')
  //3. Gör om datan till json-objekt så att vi i sin tur kan hantera den i JS
  const data = await res.json()
  //4. Detta blir då variabeln för datan vi får ut
  const meals = data.meals
  //5. Gör en variabel för att skala av data
  const firstFive = meals
    .sort((a, b) => a.strMeal.localeCompare(b.strMeal)) //Listar upp i bokstavsordning
    .slice(0, 5) //Hämtar endast de första 5 måltiderna
    .map(meal=>meal.strMeal) //Gör så att konsolen endast visar själva måltiderna och inte annnan data som kateogori
  //6. Console-loggar datan så vi ser den på konsolen
  console.log(firstFive)

}
//7. Sätter igång funktionen
fetchFirstFiveMeals()



async function fetchMealByCategory(){
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
  const data = await res.json()
  const meals = data.meals

  const category = "Dessert" //Variabel för den kategori vi vill visa

  /*Skapar en lista med objekt och filtrerar efter de villkor vi skriver in inom parantesen.
  Filter jämför kategorin från API:n (strCategory) med den kategori vi vill att den ska hämta (vilket i detta fall är "Dessert")
  Vi vill inte att jämförelsen ska strula på grund av stora och småbokstäver. toLowerCase gör alla bokstäver små så att jämförelsen stämmer
   */
  const filter = meals.filter(meal => meal.strCategory.toLowerCase() === category.toLowerCase())

  //Funktion som går igenom varenda meal-objekt i API:n
  filter.forEach(meal => {
    //Printar meal.strMeal (måltidsnamnet) i konsolen samt meal.strCategory (den valda kategorin, "Dessert i detta fallet)
    console.log(meal.strMeal + " - " + meal.strCategory)
  })
}
//Kör igån funktionen
fetchMealByCategory()



async function mealCategoryCount(){
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
  const data = await res.json()
  const meals = data.meals

  /*1. En funktion som går igenom varenda objekt i en array och "reducerar" de till ett värde
  "acc" blir själva räknaren. Visar hur många måltider av en kategori
  "meal" är varenda objekt i arrayen
   */
  const categoryCount = meals.reduce((acc, meal) => {
    //En variabel för varenda kategori som ska räknas
    const cat = meal.strCategory
    /*Säger: Lägg till 1 i räknaren för varje kategori.
    Eftersom att räknaren är tom i början måste vi lägga in || 0 som betyder "eller 0".
    Finns ingrediens i listan, öka med 1. Finns den inte, börja på 0 och öka med 1
     */
    acc[cat] = (acc[cat] || 0) + 1
    //Uppdaterar räknaren med det nya värdet
    return acc
  }, {}) //{} betyder att startvärdet är tomt
  //Printar räknaren i konsolen
  console.log(categoryCount)
}
mealCategoryCount()


//1. Skapar en funktion som går igenom objekten. Items blir datan vi fick och "key" är nyckeln vi söker (Kategorin i detta fall)
function groupBy (items, key){
  //Reduce-funktion som går igenom objekten i arrayen och samlar ihop dessa till ett resultat.
  return items.reduce((acc, item) => {
    //Kollar om det redan finns en lista för en viss kategori. Finns det inte så skapas det en. Push lägger sedan in rätt måltid i rätt lista
    (acc[item[key]]||=[]).push(item.strMeal)
    //Uppdaterar accumulatorn varje gång reduce går ett varv
    return acc
  }, {})
}
async function groupKey () {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
  const data = await res.json()
  const meals = data.meals
  //Lägger in variabler för "items" och "key". Items blir då den data vi fick från API:n. "key" blir nyckeln, i detta fall kategorierna
  const group = groupBy(meals,"strCategory")
  //Printar groupBy-funktionen som finns i variabeln "group" i konsolen
  console.log(group)
}
//2. Kör igång funktionen
groupKey()


async function remapMeal () {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
  const data = await res.json()
  const meals = data.meals
  /*1. .map skapar en ny array för varje måltid så att vi kan strukturera den som vi vill
  I detta fall vill vi att varje array ska innehålla måltid ID, måltidsnamn, måltidskategori samt ingredienslista
   */
  const summary = meals.map(meal =>{
    const id = meal.idMeal
    const mealName = meal.strMeal
    const categoryName = meal.strCategory

    const ingredientList = [] //Skapar tom array för ingredienslistan
    /*for-lop som går igenom varenda ingrediens
     Körs så länge i<=20 då en måltid kan ha upp till 20 ingredienser (i denna databas)
     */
    for (let i= 1; i<=20; i++){
      //Variabel för ingrediens. "i" står då för ingrediensnummer och kan gå ända upp till 20
      const ingredient = meal[`strIngredient${i}`]
      //Säger: Om ingredient finns d.v.s. om den inte är tom, lägg in ingrediens i ingredientList-arrayen
      if (ingredient) ingredientList.push(ingredient)
    }

    //2. Returnerar objekt med de värden vi vill ska visas
    return{
      id,
      mealName,
      categoryName,
      ingredientList
    }

  })
  //3. Printar i konsolen
  console.log(summary)

}
remapMeal()


async function frequency () {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c')
  const data = await res.json()
  const meals = data.meals

  //1. Skapar tom array för alla ingredienser.
  const gatherIngredients = []
  meals.forEach(meal =>{
    //for-loop igen som körs så länge i<=20, då det som sagt kan finnas upp till 20 ingredienser
    for (let i=1;i<=20;i++){
      const ingredient = meal[`strIngredient${i}`] //Variabel för en ingrediens

      /*Säger: Om ingrediens finns SAMT om den inte bara är tom sträng med mellanslag, lägg in den i ingredientList
      .trim tar bort onödiga mellanslag som annars skulle kunna lägga in oönskade objekt i arrayen
      Om .trim inte fanns med så finns det en risk att: " " listas som en ingrediens trots att den är tom då den innehåller mellanslag
      Det finns även risk att en ingrediens listas flera gånger, exempelvis kan "Sugar" och "Sugar " listas som två separata ingredienser, p.g.a. mellanslaget
      .toLowerCase gör så att ingredienserna skrivs i småbokstäver, så att samma ingrediens inte printas flera gånger p.g.a. stora och små bokstäver
       */
      if (ingredient && ingredient.trim()){
        gatherIngredients.push(ingredient.trim().toLowerCase())
      }
    }
  })

  //En reduce-funktion som går igenom alla ingredienser vi fått från datan
  const ingredientCount = gatherIngredients.reduce((acc, ingredient) =>{
    //Som tidigare: Om ingrediens finns i acc, öka med 1. Finns det inte så börjar den på 0 och ökar med 1
    acc[ingredient] = (acc[ingredient]||0) + 1
    //Uppdaterar räknaren med det nya värdet
    return acc
  }, {})
  //Printar i konsolen
  console.log(ingredientCount)
}
frequency()

