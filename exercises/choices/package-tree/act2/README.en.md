[🌐 English](./README.en.md)

# Act 2 — a pallet, and how many items shipped

Ravensgate is adding a fourth node to the package tree: a **pallet**. A pallet wraps one or
more cartons for a single consolidated stop on the truck, and it has its own weight - the
wood or plastic of the pallet itself (`tareWeightKg`) - on top of everything stacked on it.

- **`totalWeight`** on a pallet is its own `tareWeightKg` **plus** the total weight of
  everything inside it.
- **`totalVolume`** on a pallet is exactly the total volume of everything inside it - the
  pallet itself adds no volume of its own.
- A new traversal, **`totalItemCount`**, counts how many items are in a tree - each `Item`
  leaf counts as 1; cartons and pallets contribute nothing of their own, only what their
  children count to.
- Every existing behaviour for `Item` and `Carton` - including `totalWeight` and
  `totalVolume` on trees with no pallet in them at all - stays exactly as act 1 left it.

## Done when (act 2)

- `./dp test package-tree --act2 --solution <your-candidate>` is green.
- A pallet's weight includes its tare; a pallet's volume does not.
- `totalItemCount` counts only items, at any depth, through cartons and pallets alike.
- A tree with no pallet in it totals exactly as it did in act 1.

## Then run `./dp trade package-tree`
