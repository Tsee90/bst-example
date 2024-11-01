class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  setLeft(node) {
    this.left = node;
  }

  getLeft() {
    return this.left;
  }

  setRight(node) {
    this.right = node;
  }

  getRight() {
    return this.right;
  }
}

class Tree {
  constructor(arr) {
    this.root = this.buildTree(arr, 0, arr.length - 1);
  }

  buildTree(arr, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new Node(arr[mid]);

    root.setLeft(this.buildTree(arr, start, mid - 1));
    root.setRight(this.buildTree(arr, mid + 1, end));

    return root;
  }

  insert(value, currentNode = this.root) {
    if (value <= currentNode.data) {
      if (currentNode.left === null) {
        currentNode.left = new Node(value);
      } else {
        this.insert(value, currentNode.left);
      }
    } else {
      if (currentNode.right === null) {
        currentNode.right = new Node(value);
      } else {
        this.insert(value, currentNode.right);
      }
    }
  }

  delete(value, currentNode = this.root) {
    if (!this.find(value)) throw new Error(`'${value}' does not exist in tree`);

    if (currentNode === null) {
      return currentNode;
    } else if (value < currentNode.data) {
      currentNode.left = this.delete(value, currentNode.left);
    } else if (value > currentNode.data) {
      currentNode.right = this.delete(value, currentNode.right);
    } else {
      if (currentNode.left === null && currentNode.right === null) {
        currentNode = null;
      } else if (currentNode.left === null) {
        currentNode = currentNode.right;
      } else if (currentNode.right === null) {
        currentNode = currentNode.left;
      } else {
        const successor = this.getSuccesor(currentNode);
        currentNode.data = successor.data;
        currentNode.right = this.delete(successor.data, currentNode.right);
      }
    }
    return currentNode;
  }

  getSuccesor(currentNode) {
    currentNode = currentNode.right;
    while (currentNode !== null && currentNode.left !== null) {
      currentNode = currentNode.left;
    }
    return currentNode;
  }

  find(value, currentNode = this.root) {
    if (currentNode === null) return false;

    if (value === currentNode.data) return true;

    if (this.find(value, currentNode.left)) return true;

    if (this.find(value, currentNode.right)) return true;

    return false;
  }

  getNode(value, currentNode = this.root, found = null) {
    if (currentNode === null) return;
    if (value === currentNode.data) {
      found = currentNode;
      return found;
    }

    const checkLeft = this.getNode(value, currentNode.left, found);
    if (checkLeft) {
      return checkLeft;
    }

    return this.getNode(value, currentNode.right, found);
  }

  levelOrder(callback) {
    if (this.root === null) throw new Error('Tree is null');
    if (typeof callback !== 'function')
      throw new Error(
        `levelOrder requires a function as an argument. '${callback}' is not a function`
      );
    let queue = [];
    queue.push(this.root);
    while (queue.length > 0) {
      const current = queue.shift();
      callback(current.data);
      if (current.left !== null) {
        queue.push(current.left);
      }
      if (current.right !== null) {
        queue.push(current.right);
      }
    }
  }

  inOrder(callback, currentNode = this.root) {
    if (this.root === null) throw new Error('Tree is null');
    if (typeof callback !== 'function')
      throw new Error(
        `levelOrder requires a function as an argument. '${callback}' is not a function`
      );

    if (currentNode) {
      this.inOrder(callback, currentNode.left);
      callback(currentNode.data);
      this.inOrder(callback, currentNode.right);
    }
  }

  preOrder(callback, currentNode = this.root) {
    if (this.root === null) throw new Error('Tree is null');
    if (typeof callback !== 'function')
      throw new Error(
        `levelOrder requires a function as an argument. '${callback}' is not a function`
      );
    if (currentNode) {
      callback(currentNode.data);
      this.preOrder(callback, currentNode.left);
      this.preOrder(callback, currentNode.right);
    }
  }

  postOrder(callback, currentNode = this.root) {
    if (this.root === null) throw new Error('Tree is null');
    if (typeof callback !== 'function')
      throw new Error(
        `levelOrder requires a function as an argument. '${callback}' is not a function`
      );
    if (currentNode) {
      this.postOrder(callback, currentNode.left);
      this.postOrder(callback, currentNode.right);
      callback(currentNode.data);
    }
  }

  height(node) {
    if (!node) {
      return -1;
    }

    const countLeft = this.height(node.left);
    const countRight = this.height(node.right);

    return 1 + Math.max(countLeft, countRight);
  }

  depth(node, currentNode = this.root, depth = 0) {
    if (!currentNode) {
      return -1;
    }

    if (currentNode.data === node.data) {
      return depth;
    }

    const countLeft = this.depth(node, currentNode.left, depth + 1);
    if (countLeft !== -1) {
      return countLeft;
    }

    return this.depth(node, currentNode.right, depth + 1);
  }

  isBalanced() {
    if (this.root === null) throw new Error('Tree is null');
    const leftHeight = this.height(this.root.left);
    const rightHeight = this.height(this.root.right);

    if (
      leftHeight === rightHeight ||
      leftHeight - 1 === rightHeight ||
      rightHeight - 1 === leftHeight
    ) {
      return true;
    }
    return false;
  }

  reBalance() {
    if (this.isBalanced()) return;
    const nodeList = [];
    this.buildInOrderArray(this.root, nodeList);
    this.root = this.buildTree(nodeList, 0, nodeList.length - 1);
  }

  buildInOrderArray(node, nodeList) {
    if (node) {
      this.buildInOrderArray(node.left, nodeList);
      nodeList.push(node.data);
      this.buildInOrderArray(node.right, nodeList);
    }
  }

  getRoot() {
    return this.root;
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

function print(value) {
  console.log(`${value}`);
}

const tree = new Tree([
  1, 2, 3, 4, 5, 6, 7, 8, 15, 30, 35, 67, 77, 80, 81, 90, 99,
]);

prettyPrint(tree.getRoot());

console.log(tree.isBalanced());

tree.insert('165');
tree.insert('173');
tree.insert('184');
tree.insert('194');

console.log(tree.isBalanced());

tree.reBalance();
prettyPrint(tree.getRoot());
console.log('Preorder:');
tree.preOrder(print);
console.log('Postoder:');
tree.postOrder(print);
console.log('InOrder:');
tree.inOrder(print);
