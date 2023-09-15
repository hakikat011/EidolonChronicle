const { encrypt, decrypt } = require('./src/rsa');
const { period, shors_breaker } = require('./src/shors_algorithm');
const { modPow } = require('./src/utils');

const bit_length = parseInt(prompt("Enter bit length: "));

const [public_k, private_k] = generate_keypair(2**bit_length);

const plain_txt = prompt("Enter a message: ");
const [cipher_txt, cipher_obj] = encrypt(plain_txt, public_k);

console.log("Encrypted message: " + cipher_txt);

console.log("Decrypted message: " + decrypt(cipher_obj, private_k));

const N_shor = public_k[1];
if (N_shor > 0) {
    const [p, q] = shors_breaker(N_shor);
    const phi = (p - 1) * (q - 1);
    const d_shor = modPow(public_k[0], phi);

    console.log("Message Cracked using Shors Algorithm: " + decrypt(cipher_obj, [d_shor, N_shor]));
} else {
    console.error("Input must be positive");
}
