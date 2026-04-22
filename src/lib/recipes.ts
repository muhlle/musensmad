import breakfastImg from "@/assets/recipes/breakfast.jpg";
import lunchImg from "@/assets/recipes/lunch.jpg";
import dinnerImg from "@/assets/recipes/dinner.jpg";
import snackImg from "@/assets/recipes/snack.jpg";
import dessertImg from "@/assets/recipes/dessert.jpg";

export type RecipeCategory = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: RecipeCategory;
  servings?: number;
  timeMinutes?: number;
}

export const CATEGORY_IMAGES: Record<RecipeCategory, string> = {
  breakfast: breakfastImg,
  lunch: lunchImg,
  dinner: dinnerImg,
  snack: snackImg,
  dessert: dessertImg,
};

// 100 low-FODMAP dishes. Ingredients & instructions are simplified, low-FODMAP friendly versions
// (no onion/garlic — use chives, scallion greens, or garlic-infused oil).
export const RECIPES: Recipe[] = [
  {
    id: "1", title: "Low FODMAP Blueberry Muffins", category: "breakfast", servings: 12, timeMinutes: 35,
    description: "Soft, fluffy muffins bursting with fresh blueberries — gentle on the gut.",
    ingredients: ["2 cups gluten-free flour", "1/2 cup sugar", "2 tsp baking powder", "1/2 tsp salt", "1 cup lactose-free milk", "1/3 cup vegetable oil", "1 egg", "1 tsp vanilla", "1 cup fresh blueberries"],
    instructions: ["Preheat oven to 200°C (400°F) and line a muffin tin.", "Whisk dry ingredients in a bowl.", "In another bowl, whisk milk, oil, egg and vanilla.", "Combine wet and dry, then fold in blueberries.", "Divide into liners and bake 18–22 minutes until golden."],
  },
  {
    id: "2", title: "Low FODMAP Ham & Cheese Scones", category: "breakfast", servings: 8, timeMinutes: 30,
    description: "Buttery savory scones studded with ham and sharp cheddar.",
    ingredients: ["2 cups gluten-free flour", "1 tbsp baking powder", "1/2 tsp salt", "1/3 cup cold butter", "3/4 cup lactose-free milk", "1/2 cup diced ham", "3/4 cup grated cheddar", "1 tbsp chopped chives"],
    instructions: ["Preheat oven to 220°C (425°F).", "Rub butter into flour, baking powder and salt until crumbly.", "Stir in ham, cheese and chives.", "Add milk and gently bring together.", "Shape into 8 wedges and bake 15–18 minutes until golden."],
  },
  {
    id: "3", title: "Overnight Oats & Chia", category: "breakfast", servings: 1, timeMinutes: 5,
    description: "Creamy overnight oats with chia, banana and maple syrup.",
    ingredients: ["1/2 cup rolled oats", "1 tbsp chia seeds", "3/4 cup lactose-free milk", "1 tsp maple syrup", "1/2 ripe banana, sliced", "Cinnamon to taste"],
    instructions: ["Combine oats, chia, milk and maple syrup in a jar.", "Stir well, cover and refrigerate overnight.", "Top with banana and a sprinkle of cinnamon."],
  },
  {
    id: "4", title: "Mini Frittatas Your Way", category: "breakfast", servings: 6, timeMinutes: 25,
    description: "Pop-in-the-oven egg cups with spinach, peppers and feta.",
    ingredients: ["6 eggs", "1/4 cup lactose-free milk", "1/2 cup chopped spinach", "1/2 red bell pepper, diced", "1/4 cup crumbled feta", "Salt and pepper", "Olive oil"],
    instructions: ["Preheat oven to 180°C (350°F) and grease a muffin tin.", "Whisk eggs with milk, salt and pepper.", "Distribute spinach, peppers and feta into cups.", "Pour egg mixture over and bake 18–20 minutes."],
  },
  {
    id: "5", title: "Maple Pumpkin Spice Granola", category: "breakfast", servings: 8, timeMinutes: 35,
    description: "Crunchy granola clusters with pumpkin seeds and warm spices.",
    ingredients: ["3 cups rolled oats", "1/2 cup pumpkin seeds", "1/2 cup pecans", "1/3 cup maple syrup", "1/4 cup vegetable oil", "2 tsp pumpkin pie spice", "1/2 tsp salt"],
    instructions: ["Preheat oven to 150°C (300°F).", "Mix all ingredients on a lined baking tray.", "Bake 30 minutes, stirring once, until golden.", "Cool completely before storing."],
  },
  {
    id: "6", title: "BLT Omelet", category: "breakfast", servings: 1, timeMinutes: 10,
    description: "An omelet stuffed with crispy bacon, lettuce ribbons and tomato.",
    ingredients: ["3 eggs", "2 slices bacon, cooked and crumbled", "2 tbsp diced tomato", "Handful shredded lettuce", "Salt and pepper", "Olive oil"],
    instructions: ["Beat eggs with salt and pepper.", "Cook in a small skillet with olive oil until almost set.", "Top with bacon, tomato and lettuce.", "Fold in half and serve."],
  },
  {
    id: "7", title: "Cinnamon Apple Breakfast Cookies", category: "breakfast", servings: 10, timeMinutes: 25,
    description: "Chewy oat cookies with grated apple and warm cinnamon.",
    ingredients: ["1 1/2 cups rolled oats", "1/2 cup gluten-free flour", "1 grated apple (small, low-FODMAP serve)", "1/4 cup maple syrup", "3 tbsp melted butter", "1 egg", "1 tsp cinnamon"],
    instructions: ["Preheat oven to 180°C (350°F).", "Mix all ingredients into a dough.", "Drop spoonfuls onto a lined tray.", "Bake 14–16 minutes until edges are golden."],
  },
  {
    id: "8", title: "Buckwheat Banana Pancakes", category: "breakfast", servings: 4, timeMinutes: 20,
    description: "Naturally gluten-free pancakes sweetened with ripe banana.",
    ingredients: ["1 cup buckwheat flour", "1 ripe banana, mashed", "1 cup lactose-free milk", "1 egg", "1 tsp baking powder", "Pinch of salt", "Butter for cooking"],
    instructions: ["Whisk all ingredients into a smooth batter.", "Heat butter in a skillet over medium heat.", "Pour 1/4 cup portions and cook 2 minutes per side."],
  },
  {
    id: "9", title: "Lemon Blueberry Sheet Pan Pancakes", category: "breakfast", servings: 6, timeMinutes: 25,
    description: "Bake pancakes in one tray — bright lemon zest meets blueberries.",
    ingredients: ["2 cups gluten-free flour", "2 tbsp sugar", "1 tbsp baking powder", "1 3/4 cups lactose-free milk", "2 eggs", "Zest of 1 lemon", "1 cup blueberries"],
    instructions: ["Preheat oven to 220°C (425°F).", "Whisk batter and pour into a greased sheet pan.", "Scatter blueberries over the top.", "Bake 12–15 minutes until set and golden."],
  },
  {
    id: "10", title: "Overnight Eggnog French Toast", category: "breakfast", servings: 4, timeMinutes: 30,
    description: "Custardy baked French toast soaked in spiced eggnog.",
    ingredients: ["6 slices gluten-free bread", "3 eggs", "1 1/2 cups lactose-free eggnog", "1 tsp vanilla", "1/2 tsp cinnamon", "Butter for greasing"],
    instructions: ["Whisk eggs, eggnog, vanilla and cinnamon.", "Layer bread in a greased dish, pour custard over.", "Refrigerate overnight.", "Bake at 180°C (350°F) for 35 minutes."],
  },
  {
    id: "11", title: "Red Velvet Waffles", category: "breakfast", servings: 4, timeMinutes: 20,
    description: "Vibrant cocoa waffles with a tangy lactose-free cream topping.",
    ingredients: ["1 1/2 cups gluten-free flour", "2 tbsp cocoa powder", "2 tbsp sugar", "2 tsp baking powder", "1 1/4 cups lactose-free milk", "2 eggs", "1/4 cup melted butter", "1 tsp red food coloring"],
    instructions: ["Whisk dry ingredients, then whisk in wet.", "Cook in a preheated waffle iron until done.", "Serve with lactose-free cream cheese drizzle."],
  },
  {
    id: "12", title: "Pumpkin Gingerbread Coffee Cake", category: "breakfast", servings: 9, timeMinutes: 50,
    description: "Spiced pumpkin cake with a buttery streusel topping.",
    ingredients: ["1 1/2 cups gluten-free flour", "1/2 cup sugar", "1 cup pumpkin puree", "1/3 cup oil", "2 eggs", "1 tsp baking powder", "2 tsp gingerbread spice", "1/3 cup oats + 2 tbsp butter for streusel"],
    instructions: ["Preheat oven to 180°C (350°F).", "Mix batter and pour into a greased pan.", "Sprinkle oats and butter on top.", "Bake 35–40 minutes."],
  },
  {
    id: "13", title: "Low FODMAP Home Fries", category: "breakfast", servings: 4, timeMinutes: 30,
    description: "Crispy seasoned potatoes with chives and bell pepper.",
    ingredients: ["4 potatoes, diced", "2 tbsp garlic-infused olive oil", "1 red bell pepper, diced", "1 tsp paprika", "Salt and pepper", "2 tbsp chopped chives"],
    instructions: ["Boil potatoes 6 minutes, drain.", "Heat oil in a skillet, add potatoes and pepper.", "Fry until crispy, season and finish with chives."],
  },
  {
    id: "14", title: "Breakfast Sausage Patties", category: "breakfast", servings: 6, timeMinutes: 15,
    description: "Homemade pork patties with herbs — no onion, no garlic.",
    ingredients: ["500g ground pork", "1 tsp salt", "1 tsp dried sage", "1/2 tsp pepper", "1/2 tsp maple syrup", "1/4 tsp nutmeg"],
    instructions: ["Mix all ingredients gently.", "Form into 6 patties.", "Pan-fry over medium heat 4 minutes per side."],
  },
  {
    id: "15", title: "Scrambled Eggs with Smoked Salmon & Cream Cheese", category: "breakfast", servings: 2, timeMinutes: 10,
    description: "Silky scrambled eggs folded with smoked salmon and lactose-free cream cheese.",
    ingredients: ["4 eggs", "2 tbsp lactose-free cream cheese", "60g smoked salmon", "1 tbsp chopped chives", "Butter", "Pepper"],
    instructions: ["Beat eggs with pepper.", "Cook gently in butter, stirring.", "Just before set, fold in salmon, cream cheese and chives."],
  },
  {
    id: "16", title: "Asian Chicken Salad", category: "lunch", servings: 4, timeMinutes: 20,
    description: "Crunchy cabbage and chicken salad with a sesame-ginger dressing.",
    ingredients: ["3 cups shredded cabbage", "2 cups cooked shredded chicken", "1 carrot, julienned", "2 tbsp sesame seeds", "Dressing: 3 tbsp tamari, 1 tbsp rice vinegar, 1 tbsp sesame oil, 1 tsp grated ginger, 1 tsp maple syrup"],
    instructions: ["Whisk dressing ingredients.", "Toss cabbage, chicken and carrot with dressing.", "Top with sesame seeds."],
  },
  {
    id: "17", title: "Fusilli Salad with Chickpeas", category: "lunch", servings: 4, timeMinutes: 20,
    description: "Cold pasta salad with canned chickpeas (rinsed), peppers and herbs.",
    ingredients: ["300g gluten-free fusilli", "1/2 cup canned chickpeas, well rinsed", "1 red bell pepper, diced", "1/2 cucumber, diced", "Handful parsley", "Lemon juice, olive oil, salt"],
    instructions: ["Cook pasta, drain and cool.", "Toss with chickpeas, vegetables and herbs.", "Dress with lemon, olive oil and salt."],
  },
  {
    id: "18", title: "Mason Jar Salads", category: "lunch", servings: 1, timeMinutes: 10,
    description: "Layered jar salads — dressing on the bottom, greens on top.",
    ingredients: ["2 tbsp dressing of choice", "1/2 cup cherry tomatoes", "1/2 cup cucumber", "1/2 cup quinoa", "1/2 cup chicken or chickpeas", "2 cups baby spinach"],
    instructions: ["Layer ingredients in a jar in the order listed.", "Seal and refrigerate up to 3 days.", "Shake into a bowl when ready to eat."],
  },
  {
    id: "19", title: "Tuna Macaroni Salad", category: "lunch", servings: 4, timeMinutes: 20,
    description: "Creamy tuna pasta salad with celery (1 stalk) and chives.",
    ingredients: ["250g gluten-free macaroni", "2 cans tuna, drained", "1/3 cup mayonnaise", "1 small celery stalk, diced", "2 tbsp chopped chives", "1 tbsp lemon juice"],
    instructions: ["Cook pasta, drain and cool.", "Mix with tuna, mayo, celery, chives and lemon.", "Chill before serving."],
  },
  {
    id: "20", title: "Green Goddess Chicken Salad", category: "lunch", servings: 4, timeMinutes: 15,
    description: "Shredded chicken with a herby green dressing on lettuce cups.",
    ingredients: ["2 cups cooked shredded chicken", "1/3 cup mayonnaise", "Handful basil and parsley, chopped", "1 tbsp lemon juice", "2 tbsp chopped chives", "Lettuce cups"],
    instructions: ["Blend mayo, herbs, lemon and chives.", "Toss with chicken.", "Serve in lettuce cups."],
  },
  {
    id: "21", title: "Classic Tuna Salad", category: "lunch", servings: 2, timeMinutes: 10,
    description: "Simple tuna salad with mayo, lemon and chives.",
    ingredients: ["2 cans tuna, drained", "3 tbsp mayonnaise", "1 tbsp lemon juice", "2 tbsp chopped chives", "1 small celery stalk, diced", "Salt and pepper"],
    instructions: ["Mix all ingredients in a bowl.", "Serve on gluten-free toast or lettuce."],
  },
  {
    id: "22", title: "Warm Bacon & Avocado Salad", category: "lunch", servings: 2, timeMinutes: 15,
    description: "Wilted spinach with crispy bacon and creamy avocado (1/8 serve).",
    ingredients: ["4 cups baby spinach", "4 slices bacon", "1/8 avocado, sliced (per serve)", "1 tbsp red wine vinegar", "1 tsp maple syrup", "Pepper"],
    instructions: ["Cook bacon until crispy, reserve 1 tbsp fat.", "Whisk fat with vinegar and maple syrup.", "Toss with spinach and top with bacon and avocado."],
  },
  {
    id: "23", title: "Chickpea Salad", category: "lunch", servings: 2, timeMinutes: 10,
    description: "Fresh salad with canned chickpeas (rinsed), cucumber and lemon.",
    ingredients: ["1/2 cup canned chickpeas, rinsed well", "1 cucumber, diced", "1 tomato, diced", "Handful parsley", "Olive oil, lemon juice, salt"],
    instructions: ["Combine all ingredients in a bowl.", "Dress with olive oil, lemon and salt."],
  },
  {
    id: "24", title: "Sesame Tofu Salad", category: "lunch", servings: 2, timeMinutes: 20,
    description: "Pan-fried firm tofu over crunchy greens with sesame dressing.",
    ingredients: ["200g firm tofu, cubed", "2 tbsp tamari", "1 tbsp sesame oil", "4 cups mixed greens", "1 carrot, grated", "1 tbsp sesame seeds"],
    instructions: ["Pan-fry tofu in sesame oil until golden.", "Toss with tamari.", "Serve over greens with carrot and sesame seeds."],
  },
  {
    id: "25", title: "Summer Garden Vegetable Soup", category: "lunch", servings: 4, timeMinutes: 30,
    description: "Light broth with zucchini, carrots, tomato and fresh herbs.",
    ingredients: ["1 tbsp garlic-infused oil", "2 carrots, diced", "1 zucchini, diced", "2 tomatoes, diced", "1L low-FODMAP broth", "Handful basil"],
    instructions: ["Sauté carrots in oil 3 minutes.", "Add zucchini and tomatoes, cook 2 minutes.", "Pour in broth and simmer 15 minutes.", "Stir in basil and serve."],
  },
  {
    id: "26", title: "Low FODMAP \"Onion\" Soup", category: "lunch", servings: 4, timeMinutes: 40,
    description: "All the comfort of French onion soup using leek greens and chives.",
    ingredients: ["3 cups sliced leek greens (green tops only)", "2 tbsp butter", "1 tbsp garlic-infused oil", "1L beef broth", "1 tbsp tamari", "Gluten-free bread", "Gruyère cheese"],
    instructions: ["Sauté leek greens in butter and oil until soft.", "Add broth and tamari, simmer 15 minutes.", "Top bowls with toasted bread and cheese, broil until melted."],
  },
  {
    id: "27", title: "Gazpacho", category: "lunch", servings: 4, timeMinutes: 15,
    description: "Chilled tomato soup with cucumber and red bell pepper.",
    ingredients: ["6 ripe tomatoes", "1 cucumber, peeled", "1 red bell pepper", "2 tbsp olive oil", "1 tbsp red wine vinegar", "Salt", "Chopped chives to garnish"],
    instructions: ["Blend all ingredients except chives until smooth.", "Chill 1 hour.", "Serve cold topped with chives."],
  },
  {
    id: "28", title: "Thai Chicken Coconut Broth", category: "lunch", servings: 4, timeMinutes: 25,
    description: "Fragrant coconut broth with chicken, ginger and lime.",
    ingredients: ["400ml coconut milk", "500ml low-FODMAP chicken broth", "300g chicken, sliced", "2 tbsp grated ginger", "1 tbsp tamari", "Juice of 1 lime", "Cilantro to garnish"],
    instructions: ["Simmer broth, coconut milk and ginger 5 minutes.", "Add chicken and cook 8 minutes.", "Stir in tamari and lime, garnish with cilantro."],
  },
  {
    id: "29", title: "Vegan Root Vegetable Soup", category: "lunch", servings: 4, timeMinutes: 35,
    description: "Hearty soup of carrots, parsnips and potato with rosemary.",
    ingredients: ["3 carrots", "2 parsnips", "2 potatoes", "1 tbsp garlic-infused oil", "1L vegetable broth", "1 sprig rosemary", "Salt and pepper"],
    instructions: ["Dice all vegetables.", "Sauté in oil 5 minutes.", "Add broth and rosemary, simmer 25 minutes.", "Blend until smooth."],
  },
  {
    id: "30", title: "Turkey Quinoa Meatball Soup", category: "lunch", servings: 4, timeMinutes: 35,
    description: "Light broth with herby turkey meatballs and quinoa.",
    ingredients: ["500g ground turkey", "1/4 cup cooked quinoa", "1 egg", "1 tbsp chopped chives", "1L low-FODMAP broth", "1 carrot, diced", "Handful spinach"],
    instructions: ["Mix turkey, quinoa, egg and chives, form small balls.", "Simmer in broth with carrot 15 minutes.", "Stir in spinach just before serving."],
  },
  {
    id: "31", title: "Pho Bo (Beef Pho)", category: "dinner", servings: 4, timeMinutes: 40,
    description: "Vietnamese beef noodle soup with rice noodles and fresh herbs.",
    ingredients: ["1L low-FODMAP beef broth", "1 cinnamon stick", "2 star anise", "1 tbsp grated ginger", "200g rice noodles", "200g sliced beef", "Bean sprouts, basil, lime"],
    instructions: ["Simmer broth with spices and ginger 15 minutes, strain.", "Cook noodles separately.", "Top noodles with raw beef, pour hot broth over.", "Serve with herbs and lime."],
  },
  {
    id: "32", title: "Cream of Tomato Soup", category: "lunch", servings: 4, timeMinutes: 25,
    description: "Velvety tomato soup finished with lactose-free cream and basil.",
    ingredients: ["800g canned tomatoes", "1 tbsp garlic-infused oil", "500ml broth", "1/2 cup lactose-free cream", "Sugar, salt, pepper", "Basil"],
    instructions: ["Sauté oil briefly, add tomatoes and broth.", "Simmer 15 minutes, blend smooth.", "Stir in cream and season.", "Top with basil."],
  },
  {
    id: "33", title: "Instant Pot Chicken Noodle Soup", category: "lunch", servings: 6, timeMinutes: 30,
    description: "Comforting chicken soup with carrots, celery (1 stalk) and rice noodles.",
    ingredients: ["500g chicken thighs", "2 carrots, sliced", "1 celery stalk, sliced", "1.5L low-FODMAP broth", "1 tsp dried thyme", "200g rice noodles", "Chopped parsley"],
    instructions: ["Pressure cook chicken, carrots, celery, broth and thyme 15 minutes.", "Shred chicken, add noodles and cook 5 minutes.", "Garnish with parsley."],
  },
  {
    id: "34", title: "Cold Soba Soup", category: "lunch", servings: 2, timeMinutes: 15,
    description: "Refreshing chilled soba (100% buckwheat) in a tamari-ginger broth.",
    ingredients: ["200g 100% buckwheat soba", "2 cups dashi or low-FODMAP broth, chilled", "2 tbsp tamari", "1 tbsp mirin", "1 tsp grated ginger", "Sliced scallion greens, sesame seeds"],
    instructions: ["Cook soba, rinse under cold water.", "Mix broth, tamari, mirin and ginger.", "Pour over noodles and top with scallion greens and sesame."],
  },
  {
    id: "35", title: "Shrimp & Corn Chowder", category: "lunch", servings: 4, timeMinutes: 30,
    description: "Creamy chowder with shrimp, potatoes and a small portion of corn.",
    ingredients: ["300g shrimp", "2 potatoes, diced", "1/2 cup canned corn (low-FODMAP serve)", "500ml broth", "1/2 cup lactose-free cream", "1 tbsp garlic-infused oil", "Chives"],
    instructions: ["Sauté potatoes in oil, add broth and simmer 12 minutes.", "Add corn and shrimp, cook 4 minutes.", "Stir in cream and chives."],
  },
  {
    id: "36", title: "Whole Roast Chicken & Vegetables", category: "dinner", servings: 4, timeMinutes: 90,
    description: "Lemon-herb roast chicken with potatoes, carrots and parsnips.",
    ingredients: ["1 whole chicken (1.5kg)", "1 lemon, halved", "2 sprigs rosemary", "3 potatoes, quartered", "2 carrots, chunked", "2 parsnips, chunked", "Garlic-infused olive oil", "Salt and pepper"],
    instructions: ["Preheat oven to 200°C (400°F).", "Stuff chicken with lemon and rosemary, rub with oil and seasoning.", "Surround with vegetables, drizzle with oil.", "Roast 70–80 minutes."],
  },
  {
    id: "37", title: "Chicken & Sausage Jambalaya", category: "dinner", servings: 4, timeMinutes: 40,
    description: "One-pot rice dish with chicken, sausage, peppers and Cajun spices.",
    ingredients: ["300g chicken, cubed", "200g andouille sausage, sliced", "1 red bell pepper, diced", "1 cup long-grain rice", "2 cups low-FODMAP broth", "1 can diced tomatoes", "1 tbsp Cajun spice (no garlic/onion)", "Scallion greens"],
    instructions: ["Brown chicken and sausage in a pot.", "Add pepper, spice, rice, tomatoes and broth.", "Cover and simmer 20 minutes until rice is tender.", "Top with scallion greens."],
  },
  {
    id: "38", title: "Tuna Salad Sandwiches", category: "lunch", servings: 2, timeMinutes: 10,
    description: "Tuna salad piled on toasted gluten-free bread.",
    ingredients: ["2 cans tuna", "3 tbsp mayonnaise", "1 tbsp lemon juice", "2 tbsp chopped chives", "4 slices gluten-free bread", "Lettuce"],
    instructions: ["Mix tuna, mayo, lemon and chives.", "Toast bread, layer with lettuce and tuna salad."],
  },
  {
    id: "39", title: "Cinnamon Overnight Oats", category: "breakfast", servings: 1, timeMinutes: 5,
    description: "Make-ahead oats with cinnamon, chia and a drizzle of maple.",
    ingredients: ["1/2 cup rolled oats", "1 tbsp chia", "3/4 cup lactose-free milk", "1 tsp maple syrup", "1/2 tsp cinnamon", "Walnuts to top"],
    instructions: ["Combine oats, chia, milk, maple and cinnamon.", "Refrigerate overnight.", "Top with walnuts."],
  },
  {
    id: "40", title: "English Muffin Pizzas", category: "snack", servings: 2, timeMinutes: 15,
    description: "Mini pizzas on gluten-free English muffins with mozzarella and basil.",
    ingredients: ["2 gluten-free English muffins, halved", "1/3 cup low-FODMAP tomato sauce", "1 cup shredded mozzarella", "Pepperoni slices", "Fresh basil"],
    instructions: ["Preheat oven to 200°C (400°F).", "Top muffin halves with sauce, cheese and pepperoni.", "Bake 8–10 minutes, garnish with basil."],
  },
  {
    id: "41", title: "BLT with Egg", category: "breakfast", servings: 1, timeMinutes: 15,
    description: "Crispy bacon, lettuce, tomato and a fried egg on gluten-free toast.",
    ingredients: ["3 slices bacon", "1 egg", "2 slices gluten-free bread", "Lettuce", "2 tomato slices", "Mayonnaise"],
    instructions: ["Cook bacon and fry egg.", "Toast bread and spread with mayo.", "Stack bacon, lettuce, tomato and egg."],
  },
  {
    id: "42", title: "5-Minute Microwave Cinnamon Bun", category: "dessert", servings: 1, timeMinutes: 5,
    description: "Single-serve mug cinnamon bun ready in 5 minutes.",
    ingredients: ["3 tbsp gluten-free flour", "1 tbsp sugar", "1/4 tsp baking powder", "3 tbsp lactose-free milk", "1 tbsp melted butter", "1/2 tsp cinnamon", "1 tbsp brown sugar"],
    instructions: ["Mix flour, sugar, baking powder, milk and butter in a mug.", "Sprinkle cinnamon and brown sugar on top, swirl with a knife.", "Microwave 60–90 seconds."],
  },
  {
    id: "43", title: "Maple-Soy Glazed Tempeh", category: "dinner", servings: 2, timeMinutes: 20,
    description: "Pan-fried tempeh with a sweet-savory maple-tamari glaze.",
    ingredients: ["200g tempeh, sliced", "2 tbsp tamari", "1 tbsp maple syrup", "1 tbsp rice vinegar", "1 tsp grated ginger", "1 tbsp sesame oil", "Sesame seeds"],
    instructions: ["Whisk tamari, maple, vinegar and ginger.", "Pan-fry tempeh in sesame oil until golden.", "Pour glaze over and reduce 2 minutes.", "Top with sesame seeds."],
  },
  {
    id: "44", title: "Mediterranean Grilled Cheese", category: "lunch", servings: 1, timeMinutes: 10,
    description: "Toasted sandwich with feta, mozzarella, tomato and basil.",
    ingredients: ["2 slices gluten-free bread", "30g feta", "30g mozzarella", "2 tomato slices", "Fresh basil", "Butter"],
    instructions: ["Layer cheeses, tomato and basil between bread.", "Butter outside and pan-fry until golden both sides."],
  },
  {
    id: "45", title: "Roasted Red Pepper Pasta", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Smooth roasted red pepper sauce over gluten-free pasta.",
    ingredients: ["3 red bell peppers, roasted and peeled", "2 tbsp garlic-infused oil", "1/2 cup lactose-free cream", "300g gluten-free pasta", "Parmesan", "Basil"],
    instructions: ["Blend peppers, oil and cream into a sauce.", "Cook pasta, toss with sauce.", "Top with parmesan and basil."],
  },
  {
    id: "46", title: "Brat Burgers", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Juicy bratwurst-style pork burgers with tangy mustard.",
    ingredients: ["500g ground pork", "1 tsp salt", "1/2 tsp pepper", "1/2 tsp caraway seeds", "1/2 tsp dried marjoram", "Gluten-free buns", "Mustard, lettuce"],
    instructions: ["Mix pork with seasonings, form 4 patties.", "Grill 4–5 minutes per side.", "Serve on buns with mustard and lettuce."],
  },
  {
    id: "47", title: "Za'atar Tofu Scramble", category: "breakfast", servings: 2, timeMinutes: 15,
    description: "Crumbled firm tofu cooked with za'atar, peppers and spinach.",
    ingredients: ["200g firm tofu, crumbled", "1 tbsp garlic-infused oil", "1 tsp turmeric", "2 tsp za'atar", "1/2 red bell pepper, diced", "1 cup spinach", "Salt"],
    instructions: ["Heat oil, add pepper and cook 3 minutes.", "Add tofu, turmeric and za'atar, cook 5 minutes.", "Stir in spinach until wilted."],
  },
  {
    id: "48", title: "Pesto Pasta with Vegetables", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Gluten-free pasta tossed with low-FODMAP pesto and roasted veg.",
    ingredients: ["300g gluten-free pasta", "1 zucchini, diced", "1 red bell pepper, diced", "1/3 cup low-FODMAP pesto (no garlic)", "Parmesan", "Olive oil"],
    instructions: ["Roast vegetables in oil at 200°C (400°F) for 18 minutes.", "Cook pasta, toss with pesto and vegetables.", "Top with parmesan."],
  },
  {
    id: "49", title: "Mediterranean Omelet", category: "breakfast", servings: 1, timeMinutes: 10,
    description: "Eggs filled with feta, tomato, olives and oregano.",
    ingredients: ["3 eggs", "2 tbsp diced tomato", "5 olives, sliced", "30g feta", "Pinch oregano", "Olive oil"],
    instructions: ["Beat eggs, cook in oiled skillet.", "Add fillings to one side, fold over.", "Slide onto plate."],
  },
  {
    id: "50", title: "Low FODMAP Lentil Dal", category: "dinner", servings: 4, timeMinutes: 35,
    description: "Mild dal made with canned lentils (rinsed) and warm spices.",
    ingredients: ["1 cup canned lentils, rinsed well", "1 tbsp garlic-infused oil", "1 tsp turmeric", "1 tsp cumin", "1 tsp coriander", "400ml coconut milk", "1 tomato, diced", "Cilantro"],
    instructions: ["Sauté spices in oil 30 seconds.", "Add tomato, lentils and coconut milk.", "Simmer 20 minutes, garnish with cilantro."],
  },
  {
    id: "51", title: "Sushi Bowls with Smoked Salmon", category: "lunch", servings: 2, timeMinutes: 20,
    description: "Deconstructed sushi with rice, smoked salmon, cucumber and nori.",
    ingredients: ["1 cup sushi rice, cooked", "1 tbsp rice vinegar", "150g smoked salmon", "1/2 cucumber, sliced", "1 sheet nori, shredded", "1 tbsp sesame seeds", "Tamari"],
    instructions: ["Season rice with vinegar.", "Top bowls with salmon, cucumber, nori and sesame.", "Drizzle with tamari."],
  },
  {
    id: "52", title: "Nasi Goreng", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Indonesian fried rice with chicken, scallion greens and a fried egg.",
    ingredients: ["3 cups cooked rice", "300g chicken, diced", "2 tbsp tamari (sub for kecap manis)", "1 tbsp maple syrup", "1 tbsp garlic-infused oil", "Sliced scallion greens", "4 fried eggs"],
    instructions: ["Stir-fry chicken in oil until cooked.", "Add rice, tamari and maple, toss to coat.", "Top each bowl with scallion greens and a fried egg."],
  },
  {
    id: "53", title: "Shakshuka", category: "breakfast", servings: 4, timeMinutes: 25,
    description: "Eggs poached in spiced tomato sauce with peppers.",
    ingredients: ["1 tbsp garlic-infused oil", "1 red bell pepper, diced", "800g canned tomatoes", "1 tsp paprika", "1 tsp cumin", "4 eggs", "Feta and parsley to garnish"],
    instructions: ["Sauté pepper in oil.", "Add tomatoes and spices, simmer 10 minutes.", "Make wells, crack in eggs, cover and cook until set.", "Top with feta and parsley."],
  },
  {
    id: "54", title: "Breakfast Stuffed Potato with Kale", category: "breakfast", servings: 2, timeMinutes: 60,
    description: "Baked potato loaded with sautéed kale, bacon and a runny egg.",
    ingredients: ["2 large potatoes", "2 cups chopped kale", "2 slices bacon", "2 eggs", "1 tbsp garlic-infused oil", "Salt and pepper"],
    instructions: ["Bake potatoes 50 minutes at 200°C (400°F).", "Cook bacon, then sauté kale in oil.", "Fry eggs.", "Split potatoes and stuff with kale, bacon and egg."],
  },
  {
    id: "55", title: "Quick Beef Tacos", category: "dinner", servings: 4, timeMinutes: 20,
    description: "Seasoned ground beef in corn tortillas with lettuce and cheese.",
    ingredients: ["500g ground beef", "1 tbsp garlic-infused oil", "1 tsp cumin", "1 tsp paprika", "1 tsp oregano", "8 corn tortillas", "Lettuce, cheddar, tomato"],
    instructions: ["Brown beef in oil with spices.", "Warm tortillas.", "Fill with beef, lettuce, cheese and tomato."],
  },
  {
    id: "56", title: "Sheet Pan Nachos", category: "snack", servings: 4, timeMinutes: 20,
    description: "Corn chips topped with cheese, peppers and olives, baked until melty.",
    ingredients: ["200g corn tortilla chips", "2 cups shredded cheddar", "1 red bell pepper, diced", "1/2 cup sliced olives", "1/2 cup diced tomato", "Scallion greens"],
    instructions: ["Spread chips on sheet pan, top with cheese and toppings.", "Bake at 200°C (400°F) for 8 minutes.", "Garnish with scallion greens."],
  },
  {
    id: "57", title: "Lemon Cod Sheet Pan Meal", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Cod fillets baked with potatoes, zucchini and lemon.",
    ingredients: ["4 cod fillets", "3 potatoes, sliced thin", "1 zucchini, sliced", "1 lemon, sliced", "Garlic-infused olive oil", "Thyme, salt, pepper"],
    instructions: ["Toss potatoes with oil and bake 15 minutes at 220°C (425°F).", "Add cod, zucchini and lemon, drizzle with oil.", "Bake 12 more minutes."],
  },
  {
    id: "58", title: "Spicy Lemon Pasta with Shrimp", category: "dinner", servings: 4, timeMinutes: 20,
    description: "Gluten-free pasta with shrimp, lemon, chili and parsley.",
    ingredients: ["300g gluten-free pasta", "400g shrimp", "2 tbsp garlic-infused oil", "Zest and juice of 1 lemon", "1/2 tsp chili flakes", "Parsley", "Parmesan"],
    instructions: ["Cook pasta.", "Sauté shrimp in oil with chili 3 minutes.", "Toss with pasta, lemon and parsley.", "Top with parmesan."],
  },
  {
    id: "59", title: "Cheesy Stuffed Peppers", category: "dinner", servings: 4, timeMinutes: 50,
    description: "Bell peppers stuffed with rice, ground beef and cheese.",
    ingredients: ["4 red bell peppers", "300g ground beef", "1 cup cooked rice", "1 cup canned tomatoes", "1 cup shredded cheese", "Garlic-infused oil, oregano"],
    instructions: ["Halve and seed peppers.", "Brown beef with oil and oregano, mix with rice and tomatoes.", "Stuff peppers, top with cheese.", "Bake at 190°C (375°F) for 30 minutes."],
  },
  {
    id: "60", title: "Rainbow Wraps", category: "lunch", servings: 2, timeMinutes: 10,
    description: "Colorful veggie wraps with hummus alternative and cheese.",
    ingredients: ["2 gluten-free wraps", "1/4 cup low-FODMAP spread (e.g. tahini)", "1 carrot, grated", "1/2 cucumber, sliced", "1/2 red bell pepper, sliced", "Spinach", "Cheese slices"],
    instructions: ["Spread tahini on each wrap.", "Layer veggies and cheese.", "Roll tightly and slice."],
  },
  {
    id: "61", title: "Spaghetti and Zoodles", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Half pasta, half zucchini noodles with a low-FODMAP meat sauce.",
    ingredients: ["200g gluten-free spaghetti", "2 zucchini, spiralized", "500g ground beef", "400g canned tomatoes", "1 tbsp garlic-infused oil", "Italian herbs", "Parmesan"],
    instructions: ["Brown beef in oil with herbs.", "Add tomatoes and simmer 15 minutes.", "Cook spaghetti, sauté zoodles 2 minutes.", "Combine and top with parmesan."],
  },
  {
    id: "62", title: "One-Pan Pasta & Vegetables", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Everything cooks in one pan: pasta, broth and vegetables.",
    ingredients: ["300g gluten-free pasta", "1 zucchini, diced", "1 red bell pepper, diced", "2 cups canned tomatoes", "2 cups broth", "Italian herbs", "Parmesan"],
    instructions: ["Combine all ingredients in a large pan.", "Bring to boil, then simmer 15 minutes stirring often.", "Top with parmesan."],
  },
  {
    id: "63", title: "Greek Salmon with Feta & Peppers", category: "dinner", servings: 4, timeMinutes: 30,
    description: "One-pot salmon with peppers, olives, feta and oregano.",
    ingredients: ["4 salmon fillets", "2 red bell peppers, sliced", "1/2 cup olives", "100g feta", "2 tbsp olive oil", "1 tsp oregano", "Lemon"],
    instructions: ["Sauté peppers in oil 5 minutes.", "Add salmon, olives, oregano and feta.", "Cover and cook 10 minutes.", "Finish with lemon."],
  },
  {
    id: "64", title: "Turkey Chili with Sweet Potato & Lentils", category: "dinner", servings: 6, timeMinutes: 40,
    description: "Hearty chili with turkey, sweet potato and canned lentils (rinsed).",
    ingredients: ["500g ground turkey", "1 sweet potato, diced", "1 cup canned lentils, rinsed", "800g canned tomatoes", "1 tbsp garlic-infused oil", "2 tsp cumin", "1 tsp paprika", "Cilantro"],
    instructions: ["Brown turkey in oil with spices.", "Add sweet potato, tomatoes and lentils.", "Simmer 25 minutes.", "Top with cilantro."],
  },
  {
    id: "65", title: "Moroccan Chicken", category: "dinner", servings: 4, timeMinutes: 35,
    description: "Spiced chicken with carrots, olives and lemon.",
    ingredients: ["8 chicken thighs", "2 carrots, chunked", "1/2 cup olives", "1 lemon, sliced", "2 tbsp garlic-infused oil", "1 tsp cumin", "1 tsp paprika", "1/2 tsp cinnamon"],
    instructions: ["Brown chicken in oil.", "Add carrots, olives, lemon and spices.", "Cover and simmer 25 minutes."],
  },
  {
    id: "66", title: "Pad Thai with Shrimp", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Stir-fried rice noodles with shrimp, eggs, peanuts and lime.",
    ingredients: ["250g rice noodles", "300g shrimp", "2 eggs", "3 tbsp tamari", "2 tbsp lime juice", "1 tbsp brown sugar", "Bean sprouts, peanuts, scallion greens"],
    instructions: ["Soak noodles per package.", "Stir-fry shrimp, push aside, scramble eggs.", "Add noodles, tamari, lime and sugar, toss.", "Top with sprouts, peanuts and scallion greens."],
  },
  {
    id: "67", title: "Egg Muffins with Spinach, Peppers & Bacon", category: "breakfast", servings: 6, timeMinutes: 25,
    description: "Portable egg muffins packed with veggies and crispy bacon.",
    ingredients: ["6 eggs", "1/4 cup lactose-free milk", "1/2 cup chopped spinach", "1/2 red bell pepper, diced", "3 slices bacon, cooked and crumbled", "Salt and pepper"],
    instructions: ["Preheat oven to 180°C (350°F).", "Whisk eggs, milk and seasoning.", "Distribute fillings into muffin cups, pour egg over.", "Bake 18 minutes."],
  },
  {
    id: "68", title: "Taco Stuffed Peppers", category: "dinner", servings: 4, timeMinutes: 45,
    description: "Bell peppers loaded with taco-spiced beef, rice and cheese.",
    ingredients: ["4 bell peppers", "500g ground beef", "1 cup cooked rice", "2 tsp cumin", "1 tsp paprika", "1 cup shredded cheddar", "Cilantro"],
    instructions: ["Halve peppers.", "Brown beef with spices, mix with rice.", "Stuff peppers, top with cheese.", "Bake at 190°C (375°F) for 25 minutes.", "Top with cilantro."],
  },
  {
    id: "69", title: "Thai Peanut Noodles", category: "dinner", servings: 4, timeMinutes: 20,
    description: "Rice noodles tossed in a creamy peanut-tamari sauce.",
    ingredients: ["250g rice noodles", "1/3 cup peanut butter", "3 tbsp tamari", "1 tbsp lime juice", "1 tbsp maple syrup", "1 tsp grated ginger", "Carrot ribbons, scallion greens, peanuts"],
    instructions: ["Cook noodles.", "Whisk peanut butter, tamari, lime, maple and ginger with hot water to thin.", "Toss with noodles and toppings."],
  },
  {
    id: "70", title: "Chicken with Artichokes & Olives", category: "dinner", servings: 4, timeMinutes: 30,
    description: "Pan-seared chicken with canned artichoke hearts, olives and lemon.",
    ingredients: ["4 chicken breasts", "1 can artichoke hearts (low-FODMAP serve), drained", "1/2 cup olives", "1 lemon, juiced", "2 tbsp garlic-infused oil", "Oregano"],
    instructions: ["Sear chicken in oil 4 minutes per side.", "Add artichokes, olives, lemon and oregano.", "Cover and cook 8 minutes."],
  },
  {
    id: "71", title: "Baked Spaghetti", category: "dinner", servings: 6, timeMinutes: 50,
    description: "Layered baked pasta with meat sauce and melty cheese.",
    ingredients: ["400g gluten-free spaghetti", "500g ground beef", "800g canned tomatoes", "1 tbsp garlic-infused oil", "Italian herbs", "2 cups shredded mozzarella"],
    instructions: ["Cook spaghetti.", "Brown beef with oil and herbs, add tomatoes, simmer 10 minutes.", "Combine pasta and sauce, top with cheese.", "Bake at 190°C (375°F) for 25 minutes."],
  },
  {
    id: "72", title: "Chicken Broccoli Rice Casserole", category: "dinner", servings: 6, timeMinutes: 50,
    description: "Comforting baked casserole — use only broccoli heads (low-FODMAP serve).",
    ingredients: ["3 cups cooked rice", "2 cups cooked chicken, diced", "2 cups broccoli heads (florets only)", "1 cup lactose-free cream", "1 cup shredded cheddar", "1 tbsp garlic-infused oil", "Salt and pepper"],
    instructions: ["Mix rice, chicken, broccoli, cream and oil.", "Spread in baking dish, top with cheese.", "Bake at 190°C (375°F) for 30 minutes."],
  },
  {
    id: "73", title: "Sheet Pan Chicken Fajitas", category: "dinner", servings: 4, timeMinutes: 30,
    description: "Sliced chicken with peppers and fajita spices on corn tortillas.",
    ingredients: ["500g chicken, sliced", "2 red bell peppers, sliced", "2 tbsp garlic-infused oil", "1 tsp cumin", "1 tsp paprika", "1 tsp oregano", "Corn tortillas, lime, cilantro"],
    instructions: ["Toss chicken and peppers with oil and spices.", "Roast at 220°C (425°F) for 18 minutes.", "Serve in tortillas with lime and cilantro."],
  },
  {
    id: "74", title: "Peanut Butter Brownie Bites", category: "dessert", servings: 12, timeMinutes: 15,
    description: "No-bake bites with peanut butter, oats and cocoa.",
    ingredients: ["1 cup rolled oats", "1/2 cup peanut butter", "1/4 cup maple syrup", "3 tbsp cocoa powder", "1 tsp vanilla", "Pinch salt"],
    instructions: ["Mix all ingredients into a dough.", "Roll into 12 balls.", "Chill 30 minutes."],
  },
  {
    id: "75", title: "Salted Chocolate Tart", category: "dessert", servings: 8, timeMinutes: 40,
    description: "Rich dark chocolate tart with a buttery oat crust and flaky salt.",
    ingredients: ["Crust: 1 1/2 cups oat flour, 6 tbsp butter, 2 tbsp maple syrup", "Filling: 200g dark chocolate, 1 cup lactose-free cream", "Flaky sea salt"],
    instructions: ["Press crust into tart pan, bake at 180°C (350°F) for 12 minutes, cool.", "Heat cream, pour over chopped chocolate, stir smooth.", "Pour into crust, chill 2 hours, sprinkle with salt."],
  },
  {
    id: "76", title: "No-Bake Cookie Dough Bars", category: "dessert", servings: 12, timeMinutes: 20,
    description: "Lactose-free cookie dough bars with chocolate chips.",
    ingredients: ["1 cup almond flour", "1/2 cup peanut butter", "1/4 cup maple syrup", "1 tsp vanilla", "1/3 cup dark chocolate chips", "Pinch salt"],
    instructions: ["Mix all ingredients into a dough.", "Press into a small lined pan.", "Chill 1 hour, slice into bars."],
  },
  {
    id: "77", title: "No Bake Cookies", category: "dessert", servings: 12, timeMinutes: 15,
    description: "Chewy oat cookies set on the counter — no oven required.",
    ingredients: ["1/2 cup butter", "1/2 cup sugar", "1/4 cup cocoa", "1/4 cup lactose-free milk", "1/2 cup peanut butter", "1 1/2 cups oats", "1 tsp vanilla"],
    instructions: ["Bring butter, sugar, cocoa and milk to a boil 1 minute.", "Stir in peanut butter, oats and vanilla.", "Drop spoonfuls on parchment, cool until set."],
  },
  {
    id: "78", title: "No-Bake Raspberry Cheesecake", category: "dessert", servings: 8, timeMinutes: 25,
    description: "Creamy lactose-free cheesecake topped with fresh raspberries.",
    ingredients: ["Crust: 1 1/2 cups gluten-free cookie crumbs, 5 tbsp melted butter", "Filling: 400g lactose-free cream cheese, 1/2 cup sugar, 1 cup lactose-free cream, 1 tsp vanilla", "1 cup raspberries"],
    instructions: ["Press crust into pan, chill.", "Beat cream cheese, sugar and vanilla, fold in whipped cream.", "Spread over crust, chill 4 hours, top with raspberries."],
  },
  {
    id: "79", title: "Cilantro Lime Chicken", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Bright marinated chicken with cilantro, lime and garlic-infused oil.",
    ingredients: ["4 chicken breasts", "1/4 cup garlic-infused olive oil", "1/4 cup lime juice", "Handful chopped cilantro", "1 tsp cumin", "Salt and pepper"],
    instructions: ["Marinate chicken in oil, lime, cilantro and spices 20 minutes.", "Grill or pan-sear 5 minutes per side."],
  },
  {
    id: "80", title: "Cilantro Lime Quinoa with Chicken", category: "dinner", servings: 4, timeMinutes: 30,
    description: "Fluffy quinoa with cilantro and lime, topped with grilled chicken.",
    ingredients: ["1 cup quinoa", "2 cups broth", "1/4 cup chopped cilantro", "Juice of 2 limes", "2 tbsp olive oil", "2 cooked chicken breasts, sliced"],
    instructions: ["Cook quinoa in broth.", "Stir in cilantro, lime and oil.", "Top with sliced chicken."],
  },
  {
    id: "81", title: "Low FODMAP Nourish Bowl", category: "lunch", servings: 2, timeMinutes: 25,
    description: "Quinoa, roasted veg, greens and a drizzle of tahini.",
    ingredients: ["1 cup cooked quinoa", "1 carrot, roasted", "1 zucchini, roasted", "1 cup spinach", "2 tbsp tahini", "1 tbsp lemon juice", "Sesame seeds"],
    instructions: ["Roast vegetables at 200°C (400°F) for 20 minutes.", "Assemble bowls with quinoa, greens and veg.", "Whisk tahini and lemon, drizzle on top."],
  },
  {
    id: "82", title: "One Pot Chicken & Rice (Khichdi-Inspired)", category: "dinner", servings: 4, timeMinutes: 35,
    description: "Comforting Indian-inspired pot of chicken, rice and gentle spices.",
    ingredients: ["1 cup basmati rice", "300g chicken, diced", "2 cups broth", "1 tbsp garlic-infused oil", "1 tsp turmeric", "1 tsp cumin", "1 tsp grated ginger", "Cilantro"],
    instructions: ["Sauté chicken in oil with spices.", "Add rice and broth, cover and simmer 18 minutes.", "Garnish with cilantro."],
  },
  {
    id: "83", title: "Low FODMAP Pesto", category: "snack", servings: 6, timeMinutes: 5,
    description: "Garlic-free basil pesto using garlic-infused oil for flavor.",
    ingredients: ["2 cups fresh basil", "1/3 cup pine nuts", "1/2 cup parmesan", "1/2 cup garlic-infused olive oil", "1 tbsp lemon juice", "Salt"],
    instructions: ["Blend all ingredients until smooth.", "Store in fridge up to 5 days."],
  },
  {
    id: "84", title: "Sesame Chicken", category: "dinner", servings: 4, timeMinutes: 25,
    description: "Crispy chicken in a sweet sesame-tamari sauce over rice.",
    ingredients: ["500g chicken, cubed", "2 tbsp cornstarch", "3 tbsp tamari", "2 tbsp maple syrup", "1 tbsp rice vinegar", "1 tbsp sesame oil", "1 tsp grated ginger", "Sesame seeds"],
    instructions: ["Toss chicken in cornstarch, pan-fry until crispy.", "Whisk sauce ingredients, add to pan and reduce 2 minutes.", "Top with sesame seeds, serve over rice."],
  },
  {
    id: "85", title: "Bacon Cheeseburger Macaroni", category: "dinner", servings: 4, timeMinutes: 30,
    description: "One-pot pasta with beef, bacon and a creamy cheese sauce.",
    ingredients: ["300g gluten-free macaroni", "400g ground beef", "4 slices bacon, chopped", "1 cup lactose-free milk", "1 1/2 cups shredded cheddar", "1 tbsp garlic-infused oil", "Mustard, pepper"],
    instructions: ["Brown bacon and beef in oil.", "Add cooked pasta and milk, stir in cheese until melted.", "Season with mustard and pepper."],
  },
  {
    id: "86", title: "Sweet and Sour Chicken", category: "dinner", servings: 4, timeMinutes: 30,
    description: "Crispy chicken with peppers in a tangy sweet-sour sauce.",
    ingredients: ["500g chicken, cubed", "2 tbsp cornstarch", "1 red bell pepper, chunked", "1 cup pineapple chunks (low-FODMAP serve)", "Sauce: 1/4 cup rice vinegar, 3 tbsp tamari, 3 tbsp brown sugar, 2 tbsp ketchup"],
    instructions: ["Coat chicken in cornstarch, pan-fry until golden.", "Add peppers and pineapple.", "Pour in sauce, simmer 3 minutes."],
  },
  {
    id: "87", title: "Cheesy Hashbrown Casserole", category: "dinner", servings: 8, timeMinutes: 60,
    description: "Crowd-pleasing baked hashbrowns with cheese and sour cream alternative.",
    ingredients: ["1kg frozen hashbrowns", "1 cup lactose-free sour cream", "1 cup lactose-free cream", "2 cups shredded cheddar", "2 tbsp chopped chives", "Salt and pepper"],
    instructions: ["Mix all ingredients in a baking dish.", "Bake at 190°C (375°F) for 45 minutes until golden."],
  },
  {
    id: "88", title: "Baked Hash Browns", category: "breakfast", servings: 4, timeMinutes: 35,
    description: "Crispy oven-baked hash brown patties seasoned simply.",
    ingredients: ["4 potatoes, grated and squeezed dry", "2 tbsp garlic-infused oil", "1 egg", "Salt and pepper", "Chopped chives"],
    instructions: ["Mix potato, oil, egg and seasoning.", "Form patties on a lined sheet pan.", "Bake at 220°C (425°F) for 25 minutes, flipping halfway."],
  },
  {
    id: "89", title: "Spanish Beef and Rice Casserole", category: "dinner", servings: 6, timeMinutes: 45,
    description: "Tomato-rich baked rice with ground beef and peppers.",
    ingredients: ["500g ground beef", "1 cup rice", "1 red bell pepper, diced", "800g canned tomatoes", "2 cups broth", "1 tbsp garlic-infused oil", "1 tsp paprika", "Olives"],
    instructions: ["Brown beef in oil with paprika.", "Stir in pepper, rice, tomatoes and broth.", "Pour into baking dish, top with olives.", "Bake covered at 190°C (375°F) for 35 minutes."],
  },
  {
    id: "90", title: "Avocado Green Goddess Veggie Sandwich", category: "lunch", servings: 1, timeMinutes: 10,
    description: "Loaded veggie sandwich with avocado (1/8 serve) and herby spread.",
    ingredients: ["2 slices gluten-free bread", "1/8 avocado, mashed", "2 tbsp green goddess dressing", "Lettuce", "Cucumber", "Tomato", "Sprouts"],
    instructions: ["Spread avocado and dressing on bread.", "Layer veggies and top with second slice."],
  },
  {
    id: "91", title: "Avocado Green Goddess Dressing", category: "snack", servings: 6, timeMinutes: 5,
    description: "Creamy vegan dressing with herbs and a touch of avocado.",
    ingredients: ["1/8 avocado", "Handful basil and parsley", "2 tbsp lemon juice", "1/4 cup olive oil", "2 tbsp chopped chives", "Salt"],
    instructions: ["Blend all ingredients until smooth.", "Thin with water if needed."],
  },
  {
    id: "92", title: "Hot Honey Chicken Wings", category: "dinner", servings: 4, timeMinutes: 45,
    description: "Crispy oven-baked wings glazed in spicy hot honey.",
    ingredients: ["1kg chicken wings", "1 tbsp garlic-infused oil", "Salt and pepper", "Glaze: 1/3 cup maple syrup, 1 tbsp hot sauce, 1 tbsp butter"],
    instructions: ["Toss wings with oil and seasoning.", "Bake at 220°C (425°F) for 35 minutes.", "Warm glaze in a pan, toss wings to coat."],
  },
  {
    id: "93", title: "Banana Oatmeal Muffins", category: "breakfast", servings: 12, timeMinutes: 30,
    description: "Soft, naturally sweet muffins made with banana and oats.",
    ingredients: ["2 ripe bananas, mashed", "2 cups oats", "1/2 cup lactose-free milk", "2 eggs", "1/4 cup maple syrup", "1 tsp baking powder", "1 tsp cinnamon"],
    instructions: ["Preheat oven to 180°C (350°F).", "Mix all ingredients.", "Divide into muffin cups, bake 22 minutes."],
  },
  {
    id: "94", title: "Tomato Carrot Soup", category: "lunch", servings: 4, timeMinutes: 30,
    description: "Smooth soup with carrots, tomato and a hint of ginger.",
    ingredients: ["4 carrots, chopped", "800g canned tomatoes", "1L broth", "1 tbsp garlic-infused oil", "1 tsp grated ginger", "Salt and pepper", "Basil"],
    instructions: ["Sauté carrots in oil 5 minutes.", "Add tomatoes, broth and ginger, simmer 20 minutes.", "Blend smooth, season and top with basil."],
  },
  {
    id: "95", title: "Vegetarian Shakshuka", category: "breakfast", servings: 4, timeMinutes: 25,
    description: "Eggs poached in a smoky pepper-tomato sauce.",
    ingredients: ["1 tbsp garlic-infused oil", "1 red bell pepper, diced", "800g canned tomatoes", "1 tsp paprika", "1 tsp cumin", "4 eggs", "Cilantro"],
    instructions: ["Cook pepper in oil 4 minutes.", "Add tomatoes and spices, simmer 10 minutes.", "Crack eggs into wells, cover and cook until set.", "Top with cilantro."],
  },
  {
    id: "96", title: "Brown Rice Stuffing", category: "dinner", servings: 6, timeMinutes: 50,
    description: "Vegan side stuffing with brown rice, herbs and pecans.",
    ingredients: ["2 cups cooked brown rice", "1 cup chopped leek greens", "1 celery stalk, diced", "2 tbsp garlic-infused oil", "1/2 cup pecans, chopped", "1 tsp dried sage", "1 tsp thyme"],
    instructions: ["Sauté leek greens and celery in oil 6 minutes.", "Stir in rice, pecans and herbs.", "Bake at 180°C (350°F) for 20 minutes."],
  },
  {
    id: "97", title: "Kale, Potato & Sausage Soup", category: "lunch", servings: 6, timeMinutes: 35,
    description: "Hearty soup with Italian sausage (no garlic), potatoes and kale.",
    ingredients: ["400g Italian sausage (low-FODMAP), sliced", "3 potatoes, diced", "4 cups chopped kale", "1.5L broth", "1 tbsp garlic-infused oil", "Pepper"],
    instructions: ["Brown sausage in oil.", "Add potatoes and broth, simmer 18 minutes.", "Stir in kale and cook 3 minutes more."],
  },
  {
    id: "98", title: "Low FODMAP Bolognese", category: "dinner", servings: 6, timeMinutes: 60,
    description: "Slow-simmered meat sauce with carrots, celery and tomato.",
    ingredients: ["500g ground beef", "1 carrot, finely diced", "1 celery stalk, finely diced", "2 tbsp garlic-infused oil", "800g canned tomatoes", "1 tsp oregano", "1 tsp basil", "Gluten-free pasta"],
    instructions: ["Sauté carrot and celery in oil 6 minutes.", "Add beef and brown.", "Stir in tomatoes and herbs, simmer 40 minutes.", "Serve over pasta."],
  },
  {
    id: "99", title: "Summer Smoothie", category: "snack", servings: 1, timeMinutes: 5,
    description: "Refreshing strawberry-banana smoothie with lactose-free yogurt.",
    ingredients: ["1 cup strawberries", "1/2 banana", "3/4 cup lactose-free milk", "1/4 cup lactose-free yogurt", "1 tsp maple syrup", "Ice"],
    instructions: ["Blend all ingredients until smooth."],
  },
  {
    id: "100", title: "Blueberry Smoothie", category: "snack", servings: 1, timeMinutes: 5,
    description: "Antioxidant-rich blueberry smoothie with banana and oats.",
    ingredients: ["1 cup blueberries", "1/2 banana", "2 tbsp oats", "3/4 cup lactose-free milk", "1 tsp maple syrup", "Ice"],
    instructions: ["Blend all ingredients until creamy."],
  },
];
