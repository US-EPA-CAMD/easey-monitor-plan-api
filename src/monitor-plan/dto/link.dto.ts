export class LinkDTO {
  constructor(rel: string, href: string) {
    this.rel = rel;
    this.href = href;
  }
  rel: string;
  href: string;
}
