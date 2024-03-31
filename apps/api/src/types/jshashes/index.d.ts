declare module 'jshashes' {
  class HashesClass {
    b64(input: string): string
  }

  namespace Hashes {
    export class SHA256 extends HashesClass {}
  }

  export = Hashes
}
