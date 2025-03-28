declare module "pdf-parse" {
  function pdf(
    dataBuffer: Buffer,
    options?: any
  ): Promise<{
    text: string;
    info: any;
    metadata: any;
  }>;

  export = pdf;
}
