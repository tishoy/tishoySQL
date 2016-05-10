// var operators = ['(', ')', '&', '|', '!', '=', '>', '<'];
var operators = ['(', ')', '&', '|'];

// var testSQL = 'a>3&&&&&&&&(b>4 ||||b<2) ||c==5&&&&(d!=4|e>=1&&&&e<=6)';
var testSQL = 'A&&&&&&&&(B ||||C) ||D&&&&(E|F&&&&G)';
// console.log('test input:' + testSQL);

String.prototype.replaceAll = function(sub, str) {
	// body...
	var result = this;
	while (result.indexOf(sub) !== -1) {
		// statement
		result = result.replace(sub, str);
	}
	return result;
};

//处理DIY语句
var sql = testSQL.replaceAll('&&', '&').replaceAll('||', '|'); //.replaceAll('==', '=');

var chr;
var sent = '';
var listF = [];
for (var i = 0; i < sql.length; i++) {
	if (sql.charAt(i) !== ' ') {
		chr = sql.charAt(i)
		if (operators.indexOf(chr) !== -1) {
			if (sent !== '') {
				listF.push(sent);
				sent = '';
			}
			listF.push(chr);
		} else {
			sent += chr;
		}
	}
}

//从前序回归树形结构
var node = function() {
	return {
		key: 0,
		value: 0,
		parent: 0,
		left: 0,
		right: 0
	}
};

console.log(listF);

var val;
var tempNode;
var tempStack = [];

var createTree = function(list) {
	var rootNode;
	var barcketStack = [];
	while (0 < list.length) {
		val = list.shift();
		tempNode = node();
		tempNode['key'] = tempStack.length + 1;
		if (val === '(') {
			var rightNode = solveBracket(list);
			if (rightNode) {
				rootNode['right'] = rightNode['key'];
				rightNode['parent'] = rootNode['key'];
			}
			continue;
		} else if (val === '&' || val === '|') {
			var leftNode = rootNode;
			if (leftNode) {
				tempNode['value'] = val;
				tempNode['left'] = leftNode['key']
				leftNode['parent'] = tempNode['key'];
				rootNode = tempNode;
			}
		} else {
			if (barcketStack.length > 0) {
				tempNode['parent'] = barcketStack[barcketStack.length - 1]['key']
				barcketStack[barcketStack.length - 1]['right'] = tempNode['key'];
				tempNode['value'] = val;
			} else {
				rootNode = tempNode;
				tempNode['value'] = val;
			}
		}
		tempStack.push(tempNode);
		barcketStack.push(tempNode);

	}
	return rootNode;
}

var findRoot = function(list) {
	for (var i = 0; i < list.length; i++) {
		if (list[i]['parent'] === 0) {
			return list[i];
		}
	}
	return false;
}

var solveBracket = function(list) {
	var temp = [];

	val = list.shift();
	while (val !== ')') {
		if (val === '(') {
			solveBracket(list);
		}
		temp.push(val);
		val = list.shift();
	}
	return createTree(temp);
}



var result = createTree(listF);

// console.log('root is ');
// console.log(result);
// console.log(tempStack);

//中序遍历树结构 
var BList = [];

var searchLeft = function(rNode) {
	if (rNode['left'] !== 0) {
		readTree(tempStack[rNode['left'] - 1]);
	}
}

var searchRight = function(rNode) {
	if (rNode['right'] !== 0) {
		readTree(tempStack[rNode['right'] - 1]);
	}
}

var addSelf = function(rNode) {
	BList.push(rNode);
}

var readTree = function(rootB) {
	console.log(rootB);
	addSelf(rootB);
	searchLeft(rootB);
	searchRight(rootB);

}

readTree(result);

console.log(BList);



var excuteSQL = function(sql) {
	console.log(sql);
}
var stack = [];
var sentsNum = 0;
var conn = '';
var results = [];
while (BList.length > 0) {
	// statement
	stack.push(BList.shift()['value']);

	if (stack[stack.length - 1] !== '&' && stack[stack.length - 1] !== '|') {
		sentsNum++;
		if (sentsNum === 2) {
			var result1 = excuteSQL(stack.pop());
			var result2 = excuteSQL(stack.pop());
			conn = stack.pop();
			stack.push(connResult(result1, result2, conn));
			sentsNum = 0;
		}

	}
}



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