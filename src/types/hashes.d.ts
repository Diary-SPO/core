declare module 'jshashes' {
  class HashesClass {
    /**
     * Base64 hash encoding from string.
     */
    b64(input: string): string
  }

  namespace Hashes {
    export class SHA256 extends HashesClass {}
  }

  export = Hashes
}
