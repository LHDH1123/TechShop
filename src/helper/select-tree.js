import React from "react"; // Cần import React để dùng React.createElement

export function createCategorySelect(categories, parentId = "", level = 0) {
  if (!categories || categories.length === 0) return [];

  const options = [];

  categories.forEach((category) => {
    if (category.parent_id === parentId || (!category.parent_id && !parentId)) {
      const paddingLeft = level * 20;

      // Tạo thẻ option bằng React.createElement thay vì JSX
      options.push(
        React.createElement(
          "option",
          {
            key: category._id,
            value: category._id,
            style: { paddingLeft: `${paddingLeft}px` },
          },
          `${"-- ".repeat(level)}${category.title}`
        )
      );

      const childOptions = createCategorySelect(
        categories,
        category._id,
        level + 1
      );
      if (childOptions.length > 0) {
        options.push(...childOptions);
      }
    }
  });

  return options;
}
