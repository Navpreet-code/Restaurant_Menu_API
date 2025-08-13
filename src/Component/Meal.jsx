import React, { useState, useEffect } from "react";

export const Meal = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialCategory = queryParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        const data = await res.json();
        if (data.categories) {
          const catNames = data.categories.map((c) => c.strCategory);
          setCategories(catNames);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchMeals() {
      setLoading(true);
      try {
        if (!category || category.toLowerCase() === "all") {
          if (categories.length > 0) {
            const catToFetch = categories.slice(0, 3);
            let allMeals = [];
            for (const cat of catToFetch) {
              const res = await fetch(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
              );
              const data = await res.json();
              if (data.meals) allMeals = allMeals.concat(data.meals);
            }
            setMeals(allMeals);
          } else {
            setMeals([]);
          }
        } else {
          const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
          const res = await fetch(url);
          const data = await res.json();
          setMeals(data.meals || []);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
        setMeals([]);
      }
      setLoading(false);
    }
    if (categories.length > 0) fetchMeals();
  }, [category, categories]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = selectedCategory.trim();
    setCategory(trimmed === "" ? "all" : trimmed);
    const newUrl = `${window.location.pathname}?category=${encodeURIComponent(
      trimmed === "" ? "all" : trimmed
    )}`;
    window.history.pushState(null, "", newUrl);
  };

  if (loading) {
    return (
      <h1 className="text-center m-10 font-bold text-5xl text-red-600">
        Loading meals...
      </h1>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-red-300 p-6 pt-10">
      <div className="w-full max-w-7xl flex flex-wrap items-center justify-between mb-8 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 whitespace-nowrap">
          Search <span className="text-red-800">Meals</span>
        </h1>
        <form onSubmit={handleSearch} className="flex space-x-4">
          <input
            type="text"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="Enter Category"
            className="border-3 border-black bg-gray-200 rounded-lg w-70 px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-all shadow cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <h1 className="text-4xl font-bold mb-5 text-center text-red-600 w-full max-w-7xl">
        {category.toLowerCase() === "all" || !category
          ? "All Meals (some categories)"
          : `Meals in "${category.charAt(0).toUpperCase() + category.slice(1)}"`}
      </h1>

      {meals.length === 0 ? (
        <p className="text-center text-gray-700 font-semibold">
          No meals found for this category.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-7xl">
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="border-3 border-black p-3 rounded shadow-lg bg-gray-200 flex flex-col items-center"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold text-lg mb-1 text-center">
                {meal.strMeal}
              </h2>
              <a
                href={`https://www.themealdb.com/meal.php?c=${meal.idMeal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-bold mt-auto block"
              >
                View Recipe
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
