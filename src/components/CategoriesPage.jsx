import "../styles/CategoriesPage.css";

function CategoriesPage() {
const categories = [
  {
    title: "For Study",
    text: "Everything you need for your studies: books, summaries, and school supplies.",
  },
  {
    title: "Electronics",
    text: "Computers, phones, and tech devices to support your daily student life.",
  },
  {
    title: "Appliances",
    text: "Essential items and appliances to make student living comfortable.",
  },
  {
    title: "Tools & Equipment",
    text: "Useful tools and equipment for academic and practical work.",
  },
    {
      title: "Exchange",
      text: "Trade products with other students.",
    },
    {
      title: "Donation",
      text: "Give or receive useful student items for free.",
    },
      {
    title: "Others",
    text: "Explore a variety of other useful products shared by students.",
  },
  ];

  return (
    <div className="categories-page">
      <div className="categories-page-container">
        <h1>Categories</h1>
        <p className="categories-page-intro">
          Explore all categories available in Student Marketplace.
        </p>

        <div className="categories-page-grid">
          {categories.map((category, index) => (
            <div key={index} className="categories-page-card">
              <h3>{category.title}</h3>
              <p>{category.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;