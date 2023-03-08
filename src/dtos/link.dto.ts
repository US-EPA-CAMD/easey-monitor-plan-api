import { IsString } from 'class-validator';

export class LinkDTO {
  constructor(rel: string, href: string) {
    this.rel = rel;
    this.href = href;
  }

  @IsString()
  rel: string;

  @IsString()
  href: string;
}
