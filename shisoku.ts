/*
 逆ポーランド法で全ての演算をためす
 A B C D + + +
 A B C + D + +
 A B C + + D +
 A B + C D + +
 A B + C + D +
 */

var stack = Array();
var back = Array();
var formstack = Array();
let cals : string[] = [];
const maxcal = 51;
// 4桁の数字でできるMAXは0~51。52はできない。

let paterns = [
    {   patern : [0,0,1,0,1,0,1], // AB+C+D+
        formula : '((AxB)yC)zD'   },
    {   patern : [0,0,0,1,1,0,1], // ABC++D+
        formula : '(Ay(BxC))zD'   },
    {   patern : [0,0,1,0,0,1,1], // AB+CD++
        formula : '(AxB)z(CyD)'   },
    {   patern : [0,0,0,1,0,1,1], // ABC+D++
        formula : 'Az((BxC)yD)'   },
    {   patern : [0,0,0,0,1,1,1], // ABCD+++
        formula : 'Az(By(CxD))'   }
];

main();
// console.log(allorder([1,2,3,4]));

function allcombi(){
    let combis : Array<number[]> = [];
    for(let i=0;i<10;i++){
        for(let j=i;j<10;j++){
            for(let k=j;k<10;k++){
                for(let l=k;l<10;l++){
                    combis.push([i,j,k,l]);
                }
            }
        }
    }
    /* 40までクリアできるのはこの4つだけだった
    combis = [
        [1,2,4,9],
        [1,2,5,6],
        [1,2,5,8],
        [3,4,5,6]
    ];
    */
    return combis;
}
function main() {
    // let originnums = [1, 2, 3, 4];
    // let patern = [0,0,0,0,1,1,1]; // ABCD+++
    // let formula = '1x(2x(3x4))';
    // ABCDxxx(nums.reverse());
    // tryone(nums.reverse().slice(), patern.reverse().slice(), formula, nums.slice());
    allcombi().forEach((originnums)=>{
        cals = [];
        allorder(originnums).forEach((orderednums)=>{
            paterns.forEach((pat) => {
                // console.log(orderednums);
                trypatern(orderednums, pat.patern, pat.formula);
                // console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP');
            });
            // console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        });
        // console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
        writecals();
    });
}
function writecals(){
    let count = 0;
    for(let c=0; c<=maxcal; c++){
        if(cals[c]) count++;
    }
    if(count < maxcal+1) return;
    // Only when count = maxcal+1
    for(let c=0; c<=maxcal; c++){
        console.log('' + c + ' => ' + cals[c]);
    }
}
function trypatern(nums, patern, formula){
    let newnums = [0, 0, 0, 0];
    for(let c=0; c<16; c++){
        newnums[0] = (c&8 ? -nums[0] : nums[0]);
        newnums[1] = (c&4 ? -nums[1] : nums[1]);
        newnums[2] = (c&2 ? -nums[2] : nums[2]);
        newnums[3] = (c&1 ? -nums[3] : nums[3]);
        tryone(newnums.slice().reverse(), patern.slice().reverse(), formula, newnums.slice());
        stack = [];
    }
}
function tryone(nums, patern, formula, org){
    // console.log('tryone org:' + org);
    if(patern.pop() === 1){
        if(patern.length > 0){
            plus();
            tryone(nums.slice(), patern.slice(), formula, org);
            restore();
            minus();
            tryone(nums.slice(), patern.slice(), formula, org);
            restore();
            mul();
            tryone(nums.slice(), patern.slice(), formula, org);
            restore();
            div();
            tryone(nums.slice(), patern.slice(), formula, org);
            restore();
        }else{
            plus();
            check(formula, org);
            restore();
            minus();
            check(formula, org);
            restore();
            mul();
            check(formula, org);
            restore();
            div();
            check(formula, org);
            restore();
        }
    }else{
        stack.push(nums.pop());
        tryone(nums.slice(), patern.slice(), formula, org);
        stack.pop();
    }
}
function check(formula, org){
    let out:string = '' + formula;
    // console.log('before:' + out + 'org:' + org);
    out = out.replace('A', org[0]);
    out = out.replace('B', org[1]);
    out = out.replace('C', org[2]);
    out = out.replace('D', org[3]);
    out = out.replace('x', formstack[0]);
    out = out.replace('y', formstack[1]);
    out = out.replace('z', formstack[2]);
    // console.log('after :' + out);
    let out2 = out + ' => ' + stack[0];
    // console.log(out2);
    let res;
    if(0 <= stack[0] && stack[0] <= maxcal){
        if(Math.floor(stack[0])===stack[0]){
            res = stack[0];
            if(!cals[res]) cals[res] = out;
        }else{
            res = Math.floor(stack[0] + 0.001);
            if(Math.abs(stack[0]-res) < 0.001){
                if(!cals[res]) cals[res] = out;
            }
        }
    }
}
function allorder(nums : number[]){
    let newnumses : Array<number[]> = [];
    let newnums : number[] = [];
    let nums1 = nums.slice();
    nums1.forEach((num1, index1)=>{
        let nums2 = nums1.slice();
        nums2.splice(index1,1);
        nums2.forEach((num2, index2)=>{
            let nums3 = nums2.slice();
            nums3.splice(index2,1);
            nums3.forEach((num3, index3)=>{
                let nums4 = nums3.slice();
                nums4.splice(index3,1);
                nums4.forEach((num4, index4)=>{
                    newnums = [num1, num2, num3, num4];
                    newnumses.push(newnums);
                });
            });
        });
    });
    return newnumses;
}
function backup() {
    back.push(stack[stack.length - 1]);
    back.push(stack[stack.length - 2]);
    // back[backlen] = stack[stacklen-2];
    // back[backlen+1] = stack[stacklen-1];
    // backlen+=2;
}
function restore() {
    var dum = stack.pop();
    stack.push(back.pop());
    stack.push(back.pop());
    dum = formstack.pop();
    // stack[stacklen-1] = back[backlen-2] 
    // stack[stacklen]   = back[backlen-1] 
    // backlen-=2;
    // stacklen++;
}
function plus() {
    logstack("plus");
    backup();
    formstack.push("+");
    stack.push(stack.pop() + stack.pop());
    // stack[stacklen-2] = stack[stacklen-2] + stack[stacklen-1];
    // stacklen--;
    logstack("");
}
function minus() {
    logstack("minus");
    backup();
    formstack.push("-");
    var top = stack.pop();
    stack.push(stack.pop() - top);
    logstack("");
}
function mul() {
    logstack("mul");
    backup();
    formstack.push("*");
    stack.push(stack.pop() * stack.pop());
    logstack("");
}
function div() {
    logstack("div");
    backup();
    formstack.push("/");
    var top = stack.pop();
    if (top != 0) {
        stack.push(stack.pop() / top);
    }
    else {
        var dum = stack.pop();
        stack.push(99999);
    }
    logstack("");
}
function logstack(word) {
    var msg = "";
    for (var i = 0; i < stack.length; i++) {
        msg += stack[i] + " ";
    }
    msg += word;
    // console.log(msg);
}

// var Ocheck = function () { };

// function Ocheck(){
//     logstack("check");
// }

// function ABCDxxx(nums) {
//     Ocheck = function () {
//         console.log(stack[0] + '=' + nums[0] + formstack[2] + '(' + nums[1] + formstack[1] + '(' + nums[2] + formstack[0] + nums[3] + '))');
//     };
//     stack.push(nums.pop());
//     stack.push(nums.pop());
//     stack.push(nums.pop());
//     stack.push(nums.pop());
//     plus();
//     ABCDxxx2(nums);
//     restore();
//     minus();
//     ABCDxxx2(nums);
//     restore();
//     mul();
//     ABCDxxx2(nums);
//     restore();
//     div();
//     ABCDxxx2(nums);
//     restore();
// }
// function ABCDxxx2(nums) {
//     plus();
//     ABCDxxx3(nums);
//     restore();
//     minus();
//     ABCDxxx3(nums);
//     restore();
//     mul();
//     ABCDxxx3(nums);
//     restore();
//     div();
//     ABCDxxx3(nums);
//     restore();
// }
// function ABCDxxx3(nums) {
//     plus();
//     Ocheck();
//     restore();
//     minus();
//     Ocheck();
//     restore();
//     mul();
//     Ocheck();
//     restore();
//     div();
//     Ocheck();
//     restore();
// }
// function push(item){
//     stack[stacklen] = item;
//     stacklen++;
// }
// function pop(){
//     stacklen--;
//     return stack[stacklen];
// }
