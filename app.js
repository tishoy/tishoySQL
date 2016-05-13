// var operators = ['(', ')', '&', '|', '!', '=', '>', '<'];
var operators = ['(', ')', '&', '|'];

var testSQL = 'dia>3&&&&&&&&(dia<30 &&dia<10)||dia<25';

//查询表

var testTable = {
    A: {
        diamond: 40
    }, B: {
        diamond: 30
    }, C: {
        diamond: 20
    }, D: {
        diamond: 10
    }, E: {
        diamond: 5
    }, F: {
        diamond: 3
    }, G: {
        diamond: 1
    }
};
// var testSQL = 'A&(B ||C) & I||H & D & L& (E|F&J&G)|K';
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

//-------------------------------处理DIY语句
var sqlInput = testSQL.replaceAll('&&', '&').replaceAll('||', '|'); //.replaceAll('==', '=');
console.log(sqlInput);

var inputChar;
var sentence = '';
var DLRSort = [];
var sentenceNum = 0;
var operateorsNum = 0;
for (var i = 0; i < sqlInput.length; i++) {
	if (sqlInput.charAt(i) !== ' ') {
		inputChar = sqlInput.charAt(i)
		if (operators.indexOf(inputChar) !== -1) {
			if (sentence !== '') {
				DLRSort.push(sentence);
				sentence = '';
				sentenceNum++;
			}
			DLRSort.push(inputChar);
			if (inputChar === '&' || inputChar === '|') {
				operateorsNum++;
			}
		} else {
			sentence += inputChar;
		}
	}
}

if (sentence !== '') {
	DLRSort.push(sentence);
	sentenceNum++;
}

console.log(operateorsNum);
console.log(sentenceNum);

if (sentenceNum - 1 !== operateorsNum) {
	console.log('输入字符串公式错误');
	return;
}

//---------------------------从前序回归树形结构----------------------------------
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

console.log(DLRSort);

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

var result = createTree(DLRSort);

console.log('root is ');
console.log(result);
// console.log(tempStack);


//---------------------------中序遍历树结构---------------------------------- 
var LDRTree = [];

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
	LDRTree.push(rNode);
}

var readTree = function(rootB) {
	console.log(rootB);
	addSelf(rootB);
	searchLeft(rootB);
	searchRight(rootB);

}

readTree(result);

//-----------------------------执行SQL语句----------------------------------

var findHigh = function (num, table) {
    var result = {};
    for (var k in table) {
        if (table[k]['diamond'] > num) {
            // console.log(k);
            result[k] = {};
            result[k]['diamond'] = table[k]['diamond'];
        }
    }
    return result;
}

var findLow = function (num, table) {
    var result = {};
    for (var k in table) {
        if (table[k]['diamond'] < num) {
            result[k] = {};
            result[k]['diamond'] = table[k]['diamond'];
        }
    }
    return result;
}

var symbal;
var left;
var execute = function (sql, table) {
    if (sql.indexOf('dia') !== -1) {
        left = sql.replace('dia', '');
        symbal = sql.replace('dia', '').charAt(0);
    }
    // console.log(las);
    if (symbal === '>') {
        // console.log(las.slice(1, sql.length - 1));
        return findHigh(left.slice(1, sql.length - 1), table);
    }
    if (symbal === '<') {
        // console.log(sql.slice(1, sql.length));
        return findLow(left.slice(1, sql.length - 1), table);
    }
}

var connResult = function(res1, res2, con) {
	if (con === '|') {
		return orAction(res1, res2);
	} else if (con === '&') {
		return andAction(res1, res2);
	}
}


var orAction = function (a, b) {
    var result = b;
    for (var k in a) {
        if (b[k] === undefined) {
            result[k] = a[k];
        }
    }
    return result;
}

var andAction = function (a, b) {
    var result = a;
    for (var k in a) {
        // console.log(b[k]);
        if (b[k] === undefined) {
            delete (result[k]);
        }
    }
    return result;
}

var stack = [];
var sentsNum = 0;
var conn = '';
var result;

var check = function () {
	if (stack.length < 1) {
		return result;
	}
	var table = testTable;
	if (stack[stack.length - 1] !== '&' && stack[stack.length - 1] !== '|') {
		var result0 = typeof(result) === 'string'?execute(result, table):result;
		var popResult = stack.pop();
		var result1 = typeof(popResult) === 'string'?execute(popResult, table):popResult; 
		conn = stack.pop();
		result = connResult(result1, result0, conn);
	} else {
		return result;
	}
	return check();
}

while (LDRTree.length > 0 || stack.length > 1) {
	// statement
	
	result = LDRTree.shift()['value']
	
	if (result !== '&' && result !== '|') {
		result = check(); 
	}
	stack.push(result);
	
	console.log(stack);
}


console.log(stack);

return;
