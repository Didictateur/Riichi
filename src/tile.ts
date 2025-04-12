export class Tile {
  private imgFront: HTMLImageElement = new Image();
  private imgBack: HTMLImageElement = new Image();
  private imgGray: HTMLImageElement = new Image();
  private img: HTMLImageElement = new Image();
  private imgSrc: string = "";
  private tilt: number = 0;
  
  constructor(
    private family: number,
    private value: number,
    private red: boolean
  ) {
    this.setImgSrc();
  }

  public getFamily(): number {
    return this.family;
  }

  public getValue(): number {
    return this.value;
  }

  public isEqual(family: number, value: number): boolean {
    return this.family === family && this.value === value;
  }

  public isRed(): boolean {
    return this.red;
  }

  public compare(t: Tile): number {
    // Compare d'abord par famille, puis par valeur
    if (this.family !== t.family) {
      return this.family < t.family ? -1 : 1;
    }
    if (this.value !== t.value) {
      return this.value < t.value ? -1 : 1;
    }
    return 0;
  }

  public isLessThan(t: Tile): boolean {
    return this.family < t.family || 
           (this.family === t.family && this.value <= t.value);
  }

  public setTilt(): void {
    this.tilt = (1 - 2 * Math.random()) * 0.04;
  }

  public drawTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    hidden: boolean = false,
    rotation: number = 0,
    gray: boolean = false,
    tilted: boolean = true
  ): void {
    const tileWidth = 75 * size;
    const tileHeight = 100 * size;
    const halfWidth = tileWidth / 2;
    const halfHeight = tileHeight / 2;
    const shadowScale = 0.92;
    
    // Sauvegarde du contexte et positionnement
    ctx.save();
    ctx.translate(x + halfWidth, y + halfHeight);
    ctx.rotate(rotation + (tilted ? this.tilt : 0));
    
    // Position de l'ombre (légèrement décalée)
    const shadowX = -(tileWidth * shadowScale) / 2;
    const shadowY = -(tileHeight * shadowScale) / 2;
    
    // Dessin de l'ombre (commun aux deux cas)
    ctx.drawImage(this.imgGray, shadowX, shadowY, tileWidth, tileHeight);
    
    if (hidden) {
      // Dessin du dos de la tuile
      ctx.drawImage(this.imgBack, -halfWidth, -halfHeight, tileWidth, tileHeight);
    } else {
      // Dessin de la tuile face visible
      ctx.drawImage(this.imgFront, -halfWidth, -halfHeight, tileWidth, tileHeight);
      
      // Dessin du motif sur la tuile (légèrement plus petit)
      const patternScale = 0.9;
      const patternWidth = tileWidth * patternScale;
      const patternHeight = tileHeight * patternScale;
      const patternX = -((75 - 7) * size) / 2;
      const patternY = -((100 - 10) * size) / 2;
      
      ctx.drawImage(this.img, patternX, patternY, patternWidth, patternHeight);
      
      // Appliquer un filtre gris si demandé
      if (gray) {
        ctx.drawImage(this.imgGray, -halfWidth, -halfHeight, tileWidth, tileHeight);
      }
    }
    
    ctx.restore();
  }

  public cleanup(): void {
    // Supprimer tous les gestionnaires d'événements
    const images = [this.imgFront, this.imgBack, this.imgGray, this.img];
    images.forEach(img => {
      img.onload = null;
      img.onerror = null;
    });
  }

  public async preloadImg(): Promise<void> {
    const imagesToLoad = [
      { img: this.imgFront, src: "img/Regular/Front.svg" },
      { img: this.imgBack, src: "img/Regular/Back.svg" },
      { img: this.imgGray, src: "img/Regular/Gray.svg" },
      { img: this.img, src: this.imgSrc }
    ];
    
    await Promise.all(
      imagesToLoad.map(({ img, src }) => this.loadImg(img, src))
    );
  }

  private loadImg(img: HTMLImageElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = src;
    });
  }

  private setImgSrc(): void {
    this.imgSrc = "img/Regular/";
    
    if (this.family <= 3) {
      const families = ["", "Man", "Pin", "Sou"];
      this.imgSrc += families[this.family] + String(this.value);
      
      if (this.red) {
        this.imgSrc += "-Dora";
      }
    } else if (this.family === 4) {
      const winds = ["", "Ton", "Nan", "Shaa", "Pei"];
      this.imgSrc += winds[this.value];
    } else if (this.family === 5) {
      const dragons = ["", "Chun", "Hatsu", "Haku"];
      this.imgSrc += dragons[this.value];
    }
    
    this.imgSrc += ".svg";
  }
}
