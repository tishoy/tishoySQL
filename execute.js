var testSQL = 'dia>4';

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

var char;
var symb;
var las;

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

var execute = function (sql, table) {

    if (sql.indexOf('dia') !== -1) {
        las = sql.replace('dia', '');
        symb = sql.replace('dia', '').charAt(0);
    }
    // console.log(las);
    if (symb === '>') {
        // console.log(las.slice(1, sql.length - 1));
        return findHigh(las.slice(1, sql.length - 1), table);
    }
    if (symb === '<') {
        // console.log(sql.slice(1, sql.length));
        return findLow(las.slice(1, sql.length - 1), table);
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

var r = execute(testSQL, testTable);
var b = 'dia<30';

var fAndAction = function (r, b) {
    return execute(b, r);
}

console.log('T:');
console.log(testTable);

console.log(testSQL + '&&' + b);
console.log(fAndAction(r, b));

// var testA = {A:1,B:2,C:3,D:4};
// var testB = {C:4,D:5,E:6,F:7};

// console.log('A:');
// console.log(testA);
// console.log('B:'); 
// console.log(testB);

// console.log('&:'); 
// console.log(andAction(testA, testB));
// console.log('|:');
// console.log(orAction(testA, testB));


execute(testSQL);