// var operators = ['(', ')', '&', '|', '!', '=', '>', '<'];
var operators = ['(', ')', '&', '|'];

// var testSQL = 'a>3&&&&&&&&(b>4 ||||b<2) ||c==5&&&&(d!=4|e>=1&&&&e<=6)';
var testSQL = 'A&(B ||C) & I||H & D & L& (E|F&J&G)|K';
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
var sqlInput = testSQL.replaceAll('&&', '&').replaceAll('||', '|'); //.replaceAll('==', '=');
console.log(sqlInput);

var inputChar;
var sentence = '';
var listFrontSort = [];

for (var i = 0; i < sqlInput.length; i++) {
	if (sqlInput.charAt(i) !== ' ') {
		inputChar = sqlInput.charAt(i)
		if (operators.indexOf(inputChar) !== -1) {
			if (sentence !== '') {
				listFrontSort.push(sentence);
				sentence = '';
			}
			listFrontSort.push(inputChar);
		} else {
			sentence += inputChar;
		}
	}
}
if (sentence !== '') {
	listFrontSort.push(sentence);
}

//从前序回归树形结构 

//结点
var node = function() {
	return {
		key: 0,
		value: 0,
		parent: 0,
		left: 0,
		right: 0
	}
};

console.log(listFrontSort);

var char;
var tempNode;
var tempStack = [];

var createTree = function(list) {
	var rootNode;
	var barcketStack = [];
	while (0 < list.length) {
		char = list.shift();
		tempNode = node();
		tempNode['key'] = tempStack.length + 1;
		if (char === '(') {
			var rightNode = solveBracket(list);
			if (rightNode) {
				rootNode['right'] = rightNode['key'];
				rightNode['parent'] = rootNode['key'];
			}
			continue;
		} else if (char === '&' || char === '|') {
			var leftNode = rootNode;
			if (leftNode) {
				tempNode['value'] = char;
				tempNode['left'] = leftNode['key']
				leftNode['parent'] = tempNode['key'];
				rootNode = tempNode;
			}
		} else {
			if (barcketStack.length > 0) {
				tempNode['parent'] = barcketStack[barcketStack.length - 1]['key']
				barcketStack[barcketStack.length - 1]['right'] = tempNode['key'];
				tempNode['value'] = char;
			} else {
				rootNode = tempNode;
				tempNode['value'] = char;
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

	char = list.shift();
	while (char !== ')') {
		if (char === '(') {
			solveBracket(list);
		}
		temp.push(char);
		char = list.shift();
	}
	return createTree(temp);
}

var result = createTree(listFrontSort);

console.log('root is ');
console.log(result);
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

var numResult;
var connResult = function(res1, res2, con) {
	return '(' + res1 + con + res2 + ')';
}

var excuteSQL = function(sql) {
	console.log("excute:" + sql);
	return "excute:" + sql;
}

var stack = [];
var sentsNum = 0;
var conn = '';
var results = [];
var result;

var check = function () {
	if (stack.length < 1) {
		return result;
	}
	if (stack[stack.length - 1] !== '&' && stack[stack.length - 1] !== '|') {
		var result0 = excuteSQL(result);
		var result1 = excuteSQL(stack.pop());
		conn = stack.pop();
		result = connResult(result1, result0, conn);
	} else {
		return result;
	}
	return check();
}

while (BList.length > 0 || stack.length > 1) {
	// statement
	
	result = BList.shift()['value']
	
	if (result !== '&' && result !== '|') {
		result = check(); 
	}
	stack.push(result);
	
	console.log(stack);
}


console.log(stack);

return;
