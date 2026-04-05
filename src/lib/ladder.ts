export function generateLadder(cols: number, rows: number): boolean[][] {
  const rungs: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    const row = new Array<boolean>(cols - 1).fill(false);
    let prev = false;
    for (let g = 0; g < cols - 1; g++) {
      if (prev) {
        prev = false;
        continue;
      }
      if (Math.random() < 0.48) {
        row[g] = true;
        prev = true;
      }
    }
    rungs.push(row);
  }
  return rungs;
}

export function traceLadder(cols: number, rungs: boolean[][], startCol: number): number {
  let col = startCol;
  for (let r = 0; r < rungs.length; r++) {
    if (col > 0 && rungs[r][col - 1]) col -= 1;
    else if (col < cols - 1 && rungs[r][col]) col += 1;
  }
  return col;
}
