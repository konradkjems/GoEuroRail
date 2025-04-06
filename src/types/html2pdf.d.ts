declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[] | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: Record<string, any>;
    jsPDF?: Record<string, any>;
  }

  function html2pdf(
    element: HTMLElement | string,
    options?: Html2PdfOptions
  ): {
    from: (element: HTMLElement | string) => any;
    set: (options: Html2PdfOptions) => any;
    save: () => Promise<void>;
  };

  export = html2pdf;
} 