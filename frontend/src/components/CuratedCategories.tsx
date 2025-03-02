// src/components/CuratedCategories.tsx
import React from 'react';
import { curatedCategories, Category } from '../data/curatedCategories';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/search?query=${encodeURIComponent(category.query)}`}
      className="border rounded overflow-hidden shadow hover:shadow-lg transition"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={category.imageUrl}
          alt={category.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{category.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </div>
    </Link>
  );
};

interface MainCategoryProps {
  category: Category;
}

const MainCategory: React.FC<MainCategoryProps> = ({ category }) => {
  // For main categories, we don't display an image in the header.
  // We only show a title and description.
  // Then we render a grid of subcategories that have images.
  const subcategories = category.subcategories || [];
  const displayedSubcategories = subcategories.slice(0, 4);
  const hasMore = subcategories.length > 4;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
      <p className="text-gray-700 mb-4">{category.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedSubcategories.map((subcat) => (
          <CategoryCard key={subcat.id} category={subcat} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 text-right">
          <Link
            to={`/category/${category.id}`}
            className="text-blue-600 hover:underline"
          >
            More {category.title}
          </Link>
        </div>
      )}
    </div>
  );
};

const CuratedCategories: React.FC = () => {
  return (
    <div className="mb-8">
      {curatedCategories.map((cat) => (
        <MainCategory key={cat.id} category={cat} />
      ))}
    </div>
  );
};

export default CuratedCategories;
