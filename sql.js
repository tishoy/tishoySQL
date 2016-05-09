var operators = ['(', ')', '&', '|', '!', '=', '>', '<'];

var testSQL = 'AAA&(B |C ) ||D&(E|F&G)';

//处理DIY语句
var sql = testSQL.replace(/&+/, '&').replace(/\|+/, '|').replace(/=+/, '=');
var chr;
var sent = '';
var list = [];
for (var i = 0; i < sql.length; i++) {
	if (sql.charAt(i) !== ' ') {
		chr = sql.charAt(i)
		if (operators.indexOf(chr) !== -1) {
			if (sent !== '') {
				list.push(sent);
				sent = '';
			}
			list.push(chr);
		} else {
			sent += chr;
		}
	}
}

var node = function() {
	return {
		key: 0,
		value: 0,
		parent: 0,
		left: 0,
		right: 0
	}
};

console.log(list);

var val;
var tempNode;
var stack = [];
var tempStack = [];
var temp = [];
var rootNode;
var leftNode;
var rightNode;
var num = 0;

var createTree = function(list) {

	while (0 < list.length) {
		val = list.shift();
		console.log(val);



		temp = [];

		if (val === '(') {
			val = list.shift();
			while (val !== ')') {
				temp.push(val);
				val = list.shift();
			}
			tempStack.push(createTree(temp));
		} else if (val === '&' || val === '|') {
			tempNode = node();
			tempNode['key'] = num++;
			rootNode = tempNode;
			rootNode.value = val;
			leftNode = tempStack.pop();
			leftNode.parent = rootNode['key'];
			rootNode.left = leftNode['key'];
			val = list.shift();
			if (val === '(') {
				val = list.shift();
				while (val !== ')') {
					temp.push(val);
					val = list.shift();
				}
				rightNode = createTree(temp);
				rightNode.parent = rootNode['key'];
				tempStack.push(rootNode);
				rootNode.right = rightNode['key'];
			} else {
				console.log(val);
				rightNode = node();
				rightNode.value = val;
				rightNode.parent = rootNode['key'];
				rootNode.right = rightNode['key'];
				tempStack.push(rootNode);
			}
		} else {
			tempNode = node();
			tempNode['key'] = num++;
			tempNode['value'] = val;
			tempStack.push(tempNode);
		}

		console.log(tempStack);

	}
	return rootNode;
}



var result = createTree(list);

console.log(result);


return;


stack.push(result['value']);
console.log(result['key']);

var loopTrace = function(node) {
	if (result['left'] !== 0) {
		stack.push(tree[result['left']['value']]);
		console.log(tree[result['left']['key']]);
		loopTrace(tree[result['key']]);
	}

	if (result['right'] !== 0) {
		stack.push(tree[result['right']['value']]);
		console.log(tree[result['right']['key']]);
		loopTrace(tree[result['key']]);
	}
}

loopTrace(result);

console.log(stack);