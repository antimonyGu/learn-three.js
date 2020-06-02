/*
eg.
input   0.0To1.0   raise To 1/2.2   0.0 To 255.0   round
0        0/255          0.0             0.0          0
1        1/255          0.0805597       20.542       21
2        2/255          0.1103951       28.151       28
*/
// we want to find all unique levels
const finalGammaLevelSet = new Set();
for (let i = 0; i <= 255; i++) {
    // const finalGammaLevelSet = new Set();
    finalGammaLevelSet.add(gammaCorrection(i));
    function gammaCorrection(input) {
        return Math.round(((input/255)**(1/2.2))*255.0);
    }
}
console.log('Different levels output:' + finalGammaLevelSet.size);