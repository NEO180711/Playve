/** 세로줄 인덱스 startCol에서 아래로 내려가며 가로줄을 따라 이동하는 꺾은선 좌표 (traceLadder와 동일 규칙) */
export function buildLadderPathPoints(
  cols: number,
  rungs: boolean[][],
  startCol: number,
  x0: number,
  yTop: number,
  yBot: number,
  rowGap: number
): { x: number; y: number }[] {
  const rowCount = rungs.length;
  const xs = (c: number) => x0 + c * 56;
  let col = startCol;
  let x = xs(col);
  let y = yTop;
  const pts: { x: number; y: number }[] = [{ x, y }];

  for (let r = 0; r < rowCount; r++) {
    const yRung = yTop + r * rowGap + rowGap / 2;
    pts.push({ x, y: yRung });
    let newCol = col;
    if (col > 0 && rungs[r]![col - 1]) newCol = col - 1;
    else if (col < cols - 1 && rungs[r]![col]) newCol = col + 1;
    if (newCol !== col) {
      col = newCol;
      x = xs(col);
      pts.push({ x, y: yRung });
    }
  }
  pts.push({ x, y: yBot });
  return pts;
}

export type PathSample = {
  x: number;
  y: number;
  trail: { x: number; y: number }[];
};

/** t ∈ [0,1] — 경로를 따라 진행률에 해당하는 위치와, 그 시점까지의 궤적 꼭짓점 */
export function interpolatePath(points: { x: number; y: number }[], t: number): PathSample {
  const clampedT = Math.max(0, Math.min(1, t));
  if (points.length === 0) return { x: 0, y: 0, trail: [] };
  if (points.length === 1) {
    const p = points[0]!;
    return { x: p.x, y: p.y, trail: [p] };
  }
  if (clampedT >= 1) {
    const last = points[points.length - 1]!;
    return { x: last.x, y: last.y, trail: points.map((q) => ({ ...q })) };
  }

  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const L = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    segLens.push(L);
    total += L;
  }
  if (total <= 0) {
    const p = points[0]!;
    return { x: p.x, y: p.y, trail: [{ ...p }] };
  }

  let dist = clampedT * total;
  const trail: { x: number; y: number }[] = [{ ...points[0]! }];

  for (let i = 0; i < segLens.length; i++) {
    const L = segLens[i]!;
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    if (dist < L) {
      const u = L > 0 ? dist / L : 0;
      const x = p0.x + (p1.x - p0.x) * u;
      const y = p0.y + (p1.y - p0.y) * u;
      trail.push({ x, y });
      return { x, y, trail };
    }
    dist -= L;
    trail.push({ ...p1 });
  }

  const last = points[points.length - 1]!;
  return { x: last.x, y: last.y, trail };
}
