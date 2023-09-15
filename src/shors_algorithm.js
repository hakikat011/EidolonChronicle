const { QuantumCircuit, QuantumRegister, ClassicalRegister, execute } = require('qiskit');

function period(a, N) {
    let available_qubits = 16;
    let r = -1;

    if (N >= 2 ** available_qubits) {
        console.log(`${N} is too big for IBMQX`);
    }

    let qr = new QuantumRegister(available_qubits);
    let cr = new ClassicalRegister(available_qubits);
    let qc = new QuantumCircuit(qr, cr);
    let x0 = Math.floor(Math.random() * (N - 1)) + 1;
    let x_binary = new Array(available_qubits).fill(false);

    for (let i = 1; i <= available_qubits; i++) {
        let bit_state = (N % (2 ** i) !== 0);
        if (bit_state) {
            N -= 2 ** (i - 1);
        }
        x_binary[available_qubits - i] = bit_state;
    }

    for (let i = 0; i < available_qubits; i++) {
        if (x_binary[available_qubits - i - 1]) {
            qc.x(qr[i]);
        }
    }
    let x = x0;

    while (x !== x0 || r <= 0) {
        r++;
        qc.measure(qr, cr);
        for (let i = 0; i < 3; i++) {
            qc.x(qr[i]);
        }
        qc.cx(qr[2], qr[1]);
        qc.cx(qr[1], qr[2]);
        qc.cx(qr[2], qr[1]);
        qc.cx(qr[1], qr[0]);
        qc.cx(qr[0], qr[1]);
        qc.cx(qr[1], qr[0]);
        qc.cx(qr[3], qr[0]);
        qc.cx(qr[0], qr[1]);
        qc.cx(qr[1], qr[0]);

        let result = execute(qc, 'qasm_simulator', { shots: 1024 }).result();
        let counts = result.get_counts();

        let results = [[], []];
        for (let [key, value] of Object.entries(counts)) {
            results[0].push(key);
            results[1].push(Number(value));
        }
        let s = results[0][results[1].indexOf(Math.max(...results[1]))];
    }
    return r;
}

function shors_breaker(N) {
    N = parseInt(N);
    while (true) {
        let a = Math.floor(Math.random() * (N - 1)) + 1;
        let g = gcd(a, N);
        if (g !== 1 || N === 1) {
            return [g, N / g];
        } else {
            let r = period(a, N);
            if (r % 2 !== 0) {
                continue;
            } else if (modPow(a, r / 2, N) === N - 1) {
                continue;
            } else {
                let p = gcd(modPow(a, r / 2, N) + 1, N);
                let q = gcd(modPow(a, r / 2, N) - 1, N);
                if (p === N || q === N) {
                    continue;
                }
                return [p, q];
            }
        }
    }
}

function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modPow(base, exp, mod) {
    if (exp === 0) return 1;
    if (exp % 2 === 0) {
        let half = modPow(base, exp / 2, mod);
        return (half * half) % mod;
    } else {
        return (base * modPow(base, exp - 1, mod)) % mod;
    }
}

module.exports = {
    period,
    shors_breaker
};
