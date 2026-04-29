export async function moveOrderedItem({
  items,
  index,
  direction,
  updateItem,
  refresh,
}) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return;
  }

  const currentItem = items[index];
  const nextItem = items[nextIndex];

  await Promise.all([
    updateItem(currentItem._id, { order: nextIndex }),
    updateItem(nextItem._id, { order: index }),
  ]);

  await refresh();
}
