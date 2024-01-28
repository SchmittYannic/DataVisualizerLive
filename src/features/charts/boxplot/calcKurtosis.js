//Quelle:
//https://github.com/compute-io/kurtosis/blob/master/lib/index.js
export function calcKurtosis( arr ) {
    if ( !Array.isArray( arr ) ) {
        throw new TypeError( 'kurtosis()::invalid input argument. Must provide an array.' );
    }
    var len = arr.length,
        delta = 0,
        delta_n = 0,
        delta_n2 = 0,
        term1 = 0,
        N = 0,
        mean = 0,
        M2 = 0,
        M3 = 0,
        M4 = 0,
        g;

    for ( var i = 0; i < len; i++ ) {
        N += 1;

        delta = arr[ i ] - mean;
        delta_n = delta / N;
        delta_n2 = delta_n * delta_n;

        term1 = delta * delta_n * (N-1);

        M4 += term1*delta_n2*(N*N - 3*N + 3) + 6*delta_n2*M2 - 4*delta_n*M3;
        M3 += term1*delta_n*(N-2) - 3*delta_n*M2;
        M2 += term1;
        mean += delta_n;
    }
    // Calculate the population excess kurtosis:
    g = N*M4 / ( M2*M2 ) - 3;
    // Return the corrected sample excess kurtosis:
    return (N-1) / ( (N-2)*(N-3) ) * ( (N+1)*g + 6 );
};