export class PhotoDto {
  constructor(imgUrl: string, position: number) {
    this.imgUrl = imgUrl;
    this.position = position;
  }
  imgUrl: string;
  position: number;
}
