declare module 'pptx2html' {
  export function convert(arrayBuffer: ArrayBuffer): Promise<string>;
}
