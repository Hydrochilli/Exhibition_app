
import React from "react";

type FacetItem = {
  id: string;
  title: string;
  description: string;

};

type FacetSectionProps = {
  title: string;
  items: FacetItem[];
};

const FacetSection: React.FC<FacetSectionProps> = ({ title, items }) => {
  return (
    <div className="border p-4 rounded shadow mb-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-2 border rounded hover:bg-gray-100 cursor-pointer">
            <span className="font-semibold">{item.title}</span>
        
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacetSection;
