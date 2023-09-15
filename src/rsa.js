function encrypt(plaintext, package) {
    const [e, n] = package;
    const ciphertext = [];
    for (const c of plaintext) {
        const encryptedChar = BigInt(modExp(c.charCodeAt(0), BigInt(e), BigInt(n)));
        ciphertext.push(encryptedChar.toString());
    }
    return [ciphertext.join(''), ciphertext];
}

function decrypt(ciphertext, package) {
    const [d, n] = package;
    const plaintext = [];
    for (const c of ciphertext) {
        const decryptedChar = String.fromCharCode(Number(modExp(BigInt(c), BigInt(d), BigInt(n))));
        plaintext.push(decryptedChar);
    }
    return plaintext.join('');
}

function modExp(base, exp, mod) {
    let result = BigInt(1);
    while (exp > BigInt(0)) {
        if (exp % BigInt(2) === BigInt(1)) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / BigInt(2);
    }
    return result;
}

module.exports = {
    encrypt,
    decrypt
};
