declare module 'qr-code-styling' {
  export interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    data?: string;
    image?: string;
    qrOptions?: {
      typeNumber?: number;
      mode?: string;
      errorCorrectionLevel?: string;
    };
    dotsOptions?: {
      type?: string;
      color?: string;
      gradient?: {
        type?: string;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    cornersSquareOptions?: {
      type?: string;
      color?: string;
    };
    cornersDotOptions?: {
      type?: string;
      color?: string;
    };
    backgroundOptions?: {
      color?: string;
      gradient?: {
        type?: string;
        colorStops?: Array<{ offset: number; color: string }>;
      };
    };
    imageOptions?: {
      crossOrigin?: string;
      margin?: number;
    };
  }

  export interface DownloadOptions {
    name?: string;
    extension?: string;
  }

  export default class QRCodeStyling {
    constructor(options?: QRCodeStylingOptions);
    append(container: HTMLElement): void;
    update(options: QRCodeStylingOptions): void;
    download(options?: DownloadOptions): Promise<void>;
  }
}