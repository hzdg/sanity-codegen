export function isStructureOptional(
  structure: Sanity.GroqCodegen.StructureNode,
): boolean {
  return isOptional(structure, new Set());
}

function isOptional(
  node: Sanity.GroqCodegen.StructureNode,
  visitedNodes: Set<string>,
) {
  switch (node.type) {
    case 'And':
    case 'Or': {
      // we use `some` here because that's the behavior we typically want.
      // if one is marked as optional, the whole thing is optional
      return node.children.some((child) => isOptional(child, visitedNodes));
    }
    case 'Lazy': {
      const got = node.get();
      if (visitedNodes.has(got.hash)) return false;
      return isOptional(node.get(), new Set([...visitedNodes, got.hash]));
    }
    case 'Unknown': {
      return false;
    }
    default: {
      return node.canBeOptional;
    }
  }
}