const keyPairAlgorithm = { name: 'ECDH', namedCurve: 'P-521' }

export async function generateRandomKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    keyPairAlgorithm,
    true,
    ['deriveKey', 'deriveBits'],
  )
}

export async function decryptMessage(
  ciphertext: ArrayBuffer,
  iv: Uint8Array<ArrayBufferLike>,
  sharedKey: CryptoKey,
) {
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, sharedKey, ciphertext)
}
