import { Injectable } from '@angular/core';
import { StatsService } from './stats.service';
import { Stat } from './models/stat';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private grid: Cell[][] = [];
  readonly rowCount: number = 16;
  readonly columnCount: number = 30;
  public bombsGenerated: number = Infinity;
  public isGameOver: boolean = false;
  constructor(public stats: StatsService) {
    this.startGame();
  }
  private generateNumbers(rowCount: number, columnCount: number): void {
    for (let i = 0; i < rowCount; i++)
      for (let j = 0; j < columnCount; j++)
        this.grid[i][j].countBombs();
  }
  private generateClean(rowCount: number, columnCount: number): void {
    this.grid = [];
    for (let i = 0; i < rowCount; i++) {
      let row: Cell[] = [];
      for (let j = 0; j < columnCount; j++) {
        let curCell = new Cell(
          j,
          i,
          false,//isRevealed
          false,//isBomb
          this,//board field
          0, //neighbour bomb count
          false, //isFlaged
        );

        row.push(curCell);
      }
      this.grid.push(row);
    }
  }
  private generateMines(mineCount: number): void {
    let rowCount = this.grid.length;
    let columnCount = this.grid[0].length;

    let mineLocations: { X: number, Y: number }[] = [];
    while (mineLocations.length < mineCount) {
      let mineRow = Math.floor(Math.random() * rowCount);
      let mineColumn = Math.floor(Math.random() * columnCount);

      if (!mineLocations.find(n => n.Y == mineRow && n.X == mineColumn)) {
        mineLocations.push({ X: mineColumn, Y: mineRow });
        this.grid[mineRow][mineColumn].isBomb = true;
      }
    }
  }
  private getMineCount(rowCount: number, columnCount: number): number {
    let cellCount = rowCount * columnCount;
    let mineCount = 0.0002 * Math.pow(cellCount, 2) + 0.0938 * cellCount + 0.8937
    //let mineCount = cellCount; //full mine field for testing 
    //let mineCount = 1; //1 mine for testing 
    console.log(`generated ${mineCount} mines`);

    return mineCount;
  }
  public getRows(): Cell[][] {
    return this.grid;
  }
  public getGlobalStats(): Stat[]{
    return this.stats.globalStats;
  }
  public endGame(): void{
    this.stats.stop();
    this.isGameOver = true;
  }
  public startGame(): void{
    this.generateClean(this.rowCount, this.columnCount);
    this.bombsGenerated = Math.floor(this.getMineCount(this.rowCount, this.columnCount));
    this.generateMines(this.bombsGenerated);
    this.generateNumbers(this.rowCount, this.columnCount);
    this.isGameOver = false;
    this.stats.start(this.bombsGenerated);
  }
  public restartGame(): void{
    this.endGame();
    this.startGame();
  }
}

export class Cell {

  constructor(
    public X: number,
    public Y: number,
    public isRevealed: boolean,
    public isBomb: boolean,
    public board: BoardService,
    public bombCount: number,
    public isFlaged: boolean,
  ) {}
  public countBombs(): number {
    let count = 0;

    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        let neighbour = this.getNeighbour(i, j);
        if (neighbour?.isBomb)
          count++;
      }

    this.bombCount = count;
    return count;
  }
  public countFlags(): number{
    let count = 0;

    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        let neighbour = this.getNeighbour(i, j);
        if (neighbour?.isFlaged)
          count++;
      }
    return count;    
  }
  private getNeighbour(dx: number, dy: number) {
    let neighbourX = this.X + dx;
    let neighbourY = this.Y + dy;
    if (dx == 0 && dy == 0)
      return null;

    if (!this.inbound(neighbourX, neighbourY))
      return null;

    let neighbour = this.board.getRows()[neighbourY][neighbourX];

    return neighbour;
  }
  private inbound(x: number, y: number): boolean {
    return x >= 0 && x < this.board.columnCount &&
      y >= 0 && y < this.board.rowCount;
  }
  public reveal(): void {
    if(this.isFlaged || this.board.isGameOver)
      return;

    this.isRevealed = true;
    
    if(this.isBomb)
      this.board.endGame();

    if (this.bombCount == 0)
      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
          let neighbour = this.getNeighbour(i, j);

          if (neighbour == null)
            continue;

          if (!neighbour.isRevealed &&
            !neighbour.isBomb)
            neighbour.reveal();
        }
  }
  public revealAround(): void{
    if(!this.isRevealed)
      return;
    if(!(this.countFlags() == this.bombCount))
      return;

      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
          let neighbour = this.getNeighbour(i, j);
          neighbour?.reveal();
        }
    
  }
  public flag(){
    if(this.isFlaged)
    {
      this.board.stats.addBomb();
      this.isFlaged = false;
      return false;
    }
    if(!this.isRevealed)
    {
      this.board.stats.removeBomb();
      this.isFlaged = true;
      if(this.isBomb && this.board.stats.bombsLeft == 0)
        this.board.endGame();
    }
    return false;
  }
}



